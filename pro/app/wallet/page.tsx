'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'

type Wallet = {
  available_balance: number
  processing_balance: number
  total_earned: number
}

type Tx = {
  id: string
  amount: number
  type: string
  status: string
  description?: string
  created_at: string
}

export default function WalletPage() {
  const { pro, loading } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [txs, setTxs] = useState<Tx[]>([])
  const [fetching, setFetching] = useState(true)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    if (!loading && !pro) router.replace('/login')
  }, [pro, loading, router])

  useEffect(() => {
    if (!pro) return
    supabase
      .from('pro_wallets')
      .select('*')
      .eq('professional_id', pro.id)
      .single()
      .then(({ data }) => setWallet(data as Wallet))

    supabase
      .from('wallet_transactions')
      .select('*')
      .eq('professional_id', pro.id)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setTxs((data as Tx[]) || [])
        setFetching(false)
      })
  }, [pro?.id])

  // Real-time wallet updates
  useEffect(() => {
    if (!pro) return
    const ch = supabase
      .channel(`wallet-${pro.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'pro_wallets', filter: `professional_id=eq.${pro.id}`
      }, p => setWallet(p.new as Wallet))
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'wallet_transactions', filter: `professional_id=eq.${pro.id}`
      }, p => setTxs(prev => [p.new as Tx, ...prev]))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [pro?.id])

  const handleWithdraw = async () => {
    if (!wallet || wallet.available_balance < 100) {
      alert(t.withdrawMin)
      return
    }
    setWithdrawing(true)
    // Placeholder — in production, trigger payout via Razorpay Payouts or NEFT
    await new Promise(r => setTimeout(r, 1500))
    alert('Withdrawal request submitted. Amount will be credited within 24 hours.')
    setWithdrawing(false)
  }

  if (loading || !pro) return null

  return (
    <>
      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <h1 className="font-bold text-xl text-gray-900">{t.wallet}</h1>
        </header>

        {/* Wallet card */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-[#F5A623] to-[#FF6B35] rounded-2xl p-5 shadow-lg">
          <p className="text-white/80 text-xs font-medium mb-1">{t.available}</p>
          <p className="text-white font-black text-3xl tracking-tight">
            Rs {wallet ? Math.round(wallet.available_balance) : '—'}
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/70 text-[10px]">{t.processing}</p>
              <p className="text-white font-bold text-sm">Rs {wallet ? Math.round(wallet.processing_balance) : '—'}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-white/70 text-[10px]">{t.totalEarned}</p>
              <p className="text-white font-bold text-sm">Rs {wallet ? Math.round(wallet.total_earned) : '—'}</p>
            </div>
          </div>
        </div>

        {/* Processing info */}
        {wallet && wallet.processing_balance > 0 && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-xs text-amber-700">
              Rs {Math.round(wallet.processing_balance)} on hold. Releases 1 minute after customer rating (3+ stars).
            </p>
          </div>
        )}

        {/* Withdraw button */}
        <div className="px-4 mt-4">
          <button
            onClick={handleWithdraw}
            disabled={withdrawing || !wallet || wallet.available_balance < 100}
            className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-40 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
          >
            {withdrawing ? 'Processing...' : t.withdraw}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">{t.withdrawMin}</p>
        </div>

        {/* Transactions */}
        <div className="px-4 mt-6">
          <h2 className="font-bold text-base mb-3">{t.transactions}</h2>
          {fetching ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-xl shimmer mb-2" />)
          ) : txs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t.noTransactions}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {txs.map(tx => {
                const d = new Date(tx.created_at)
                const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                const isCredit = tx.type === 'credit' || tx.type === 'release'
                return (
                  <div key={tx.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isCredit ? '#22C55E' : '#EF4444'} strokeWidth="2.5">
                          {isCredit
                            ? <polyline points="12 19 12 5 5 12 19 12" />
                            : <polyline points="12 5 12 19 5 12 19 12" />
                          }
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{tx.description || (tx.type === 'release' ? t.released : tx.type)}</p>
                        <p className="text-[10px] text-gray-400">{dateStr} · {timeStr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                        {isCredit ? '+' : '-'}Rs {Math.round(tx.amount)}
                      </p>
                      <p className={`text-[10px] font-semibold ${tx.status === 'processing' ? 'text-amber-600' : tx.status === 'available' ? 'text-green-600' : 'text-gray-400'}`}>
                        {tx.status === 'processing' ? t.held : tx.status === 'available' ? t.released : tx.status}
                      </p>
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
