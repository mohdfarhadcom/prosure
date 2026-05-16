'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

type Wallet = { balance: number; total_earned: number }
type Tx = {
  id: string; amount: number; type: string; status: string;
  created_at: string; available_at?: string | null
}

function WithdrawModal({ available, onClose, onSubmit, loading }: {
  available: number; onClose: () => void
  onSubmit: (amount: number, upiId: string) => Promise<void>; loading: boolean
}) {
  const [upiId, setUpiId] = useState('')
  const [amount, setAmount] = useState(String(Math.floor(available)))
  const [err, setErr] = useState('')

  const submit = async () => {
    setErr('')
    const amt = parseFloat(amount)
    if (!upiId.trim()) { setErr('Enter your UPI ID'); return }
    if (isNaN(amt) || amt < 100) { setErr('Minimum withdrawal is ₹100'); return }
    if (amt > available) { setErr(`Only ₹${Math.round(available)} is available`); return }
    await onSubmit(amt, upiId.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Withdraw earnings</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        <p className="text-xs text-gray-400 mb-4">Available: <span className="font-bold text-gray-700">₹{Math.round(available)}</span> · Processed within 24 hours</p>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Amount (₹)</label>
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">UPI ID</label>
          <input
            value={upiId} onChange={e => setUpiId(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
            placeholder="yourname@upi"
          />
        </div>

        {err && <p className="text-xs text-red-500 mb-3">{err}</p>}

        <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
          Your withdrawal will be reviewed and credited to your UPI account within 24 hours. Contact team@thezilpo.com if you have questions.
        </p>

        <button
          onClick={submit} disabled={loading}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit withdrawal'}
        </button>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [txs, setTxs] = useState<Tx[]>([])
  const [fetching, setFetching] = useState(true)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [pendingAmount, setPendingAmount] = useState(0)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  useEffect(() => {
    if (!pro) return
    loadWallet()
    // Trigger release of matured holds on page load
    fetch('/api/release-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId: pro.id }),
    }).then(() => loadWallet())
  }, [pro?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadWallet = async () => {
    if (!pro) return
    const [{ data: w }, { data: txData }] = await Promise.all([
      supabase.from('pro_wallets').select('*').eq('professional_id', pro.id).single(),
      supabase.from('wallet_transactions').select('*').eq('professional_id', pro.id).order('created_at', { ascending: false }).limit(30),
    ])
    setWallet(w as Wallet)
    const all = (txData as Tx[]) || []
    setTxs(all)
    // Calculate amount still under 7-day hold
    const now = new Date()
    const pending = all
      .filter(tx => tx.status === 'processing' && tx.type === 'credit' && tx.available_at && new Date(tx.available_at) > now)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0)
    setPendingAmount(pending)
    setFetching(false)
  }

  // Real-time wallet updates
  useEffect(() => {
    if (!pro) return
    const ch = supabase
      .channel(`wallet-${pro.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pro_wallets', filter: `professional_id=eq.${pro.id}` },
        () => loadWallet())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wallet_transactions', filter: `professional_id=eq.${pro.id}` },
        () => loadWallet())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [pro?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleWithdraw = async (amount: number, upiId: string) => {
    if (!pro) return
    setWithdrawing(true)
    const res = await fetch('/api/request-withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId: pro.id, amount, upiId }),
    })
    const data = await res.json()
    setWithdrawing(false)
    if (!res.ok) {
      alert(data.error || 'Withdrawal failed. Please try again.')
      return
    }
    setShowWithdraw(false)
    await loadWallet()
    alert('Withdrawal request submitted! ₹' + Math.round(amount) + ' will be credited to your UPI account within 24 hours.')
  }

  if (loading || !pro) return null

  const available = wallet ? Math.round(wallet.balance) : 0

  return (
    <>
      {showWithdraw && (
        <WithdrawModal
          available={available}
          onClose={() => setShowWithdraw(false)}
          onSubmit={handleWithdraw}
          loading={withdrawing}
        />
      )}

      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <h1 className="font-bold text-xl text-gray-900">{t.wallet}</h1>
        </header>

        {/* Wallet card */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-[#F5A623] to-[#FF6B35] rounded-2xl p-5 shadow-lg">
          <p className="text-white/80 text-xs font-medium mb-1">Available balance</p>
          <p className="text-white font-black text-3xl tracking-tight">₹{available}</p>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/70 text-[10px]">{t.totalEarned}</p>
              <p className="text-white font-bold text-sm">₹{wallet ? Math.round(wallet.total_earned) : '—'}</p>
            </div>
            {pendingAmount > 0 && (
              <div>
                <p className="text-white/70 text-[10px]">Releasing soon</p>
                <p className="text-white font-bold text-sm">₹{Math.round(pendingAmount)}</p>
              </div>
            )}
          </div>
        </div>

        {pendingAmount > 0 && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <p className="text-xs text-amber-700 font-semibold">₹{Math.round(pendingAmount)} releasing soon</p>
            <p className="text-[10px] text-amber-600 mt-0.5">Earnings are held for 7 days to protect customers. Funds release automatically.</p>
          </div>
        )}

        {/* Withdraw button */}
        <div className="px-4 mt-4">
          <button
            onClick={() => setShowWithdraw(true)}
            disabled={available < 100}
            className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-40 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
          >
            {t.withdraw} (₹{available} available)
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">Minimum ₹100 · Credited within 24 hours</p>
        </div>

        {/* Transactions */}
        <div className="px-4 mt-6">
          <h2 className="font-bold text-base mb-3">{t.transactions}</h2>
          {fetching ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-xl shimmer mb-2" />)
          ) : txs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t.noTransactions}</p>
          ) : (
            <div className="flex flex-col gap-2 pb-24">
              {txs.map(tx => {
                const d = new Date(tx.created_at)
                const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                const isCredit = tx.type === 'credit' || tx.type === 'release'
                const isWithdrawal = tx.type === 'withdrawal'

                const now = new Date()
                const releaseDate = tx.available_at ? new Date(tx.available_at) : null
                const isOnHold = tx.status === 'processing' && tx.type === 'credit' && releaseDate && releaseDate > now
                const releaseStr = releaseDate
                  ? releaseDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  : null

                let statusLabel = tx.status
                let statusColor = 'text-gray-400'
                if (isOnHold) {
                  statusLabel = releaseStr ? `Releases ${releaseStr}` : 'On hold'
                  statusColor = 'text-amber-600'
                } else if (tx.status === 'available' || tx.status === 'completed') {
                  statusLabel = 'Released'
                  statusColor = 'text-green-600'
                } else if (isWithdrawal && tx.status === 'processing') {
                  statusLabel = 'Processing'
                  statusColor = 'text-blue-600'
                }

                return (
                  <div key={tx.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isWithdrawal ? 'bg-blue-100' : isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke={isWithdrawal ? '#3B82F6' : isCredit ? '#22C55E' : '#EF4444'} strokeWidth="2.5">
                          {isWithdrawal
                            ? <path d="M12 5v14M5 12l7 7 7-7"/>
                            : isCredit
                              ? <polyline points="12 19 12 5 5 12 19 12" />
                              : <polyline points="12 5 12 19 5 12 19 12" />
                          }
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {isWithdrawal ? 'Withdrawal' : tx.type === 'release' ? 'Released' : 'Booking payment'}
                        </p>
                        <p className="text-[10px] text-gray-400">{dateStr} · {timeStr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isWithdrawal ? 'text-blue-600' : isCredit ? 'text-green-600' : 'text-red-500'}`}>
                        {isWithdrawal ? '−' : '+'}₹{Math.round(tx.amount)}
                      </p>
                      <p className={`text-[10px] font-semibold ${statusColor}`}>{statusLabel}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Navbar />
    </>
  )
}
