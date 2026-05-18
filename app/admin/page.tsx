'use client'
import { useState, useEffect, useCallback } from 'react'

type Stats = {
  users: number; professionals: number; pendingPros: number;
  totalRevenue: number; ourEarnings: number; totalBookings: number;
  openTickets: number; abandonedCarts: number
}
type Pro = { id: string; name: string; phone: string; service_type: string; gender: string; status: string; created_at: string }
type DeletionRequest = { id: string; professional_id: string; reason: string; created_at: string; professionals: { name: string; phone: string; service_type: string } }
type WithdrawalRequest = { id: string; professional_id: string; amount: number; upi_id: string; status: string; created_at: string; professionals: { name: string; phone: string } }
type IdProof = { id: string; name: string; phone: string; service_type: string; id_proof_type: string; id_proof_url: string; signed_url?: string | null; id_proof_verified: boolean; created_at: string }
type AbandonedCart = {
  id: string; user_id: string | null; phone: string | null; name: string | null;
  items: { slug?: string; name?: string }[]; subtotal: number; total: number;
  promo_code: string | null; booking_mode: string | null; last_step: string;
  location: { address?: string } | null; recovered_booking_id: string | null;
  created_at: string; updated_at: string
}
type Ticket = {
  id: string; user_id: string | null; professional_id: string | null; booking_id: string | null;
  source: 'customer' | 'professional'; category: string; phone: string; name: string | null;
  subject: string | null; message: string; rating: number | null; status: string;
  admin_note: string | null; created_at: string
}

type Tab = 'stats' | 'pros' | 'withdrawals' | 'idproofs' | 'carts' | 'tickets' | 'deletions'

const TABS: { key: Tab; label: string }[] = [
  { key: 'stats', label: 'Overview' },
  { key: 'tickets', label: 'Support' },
  { key: 'carts', label: 'Abandoned' },
  { key: 'pros', label: 'Pros' },
  { key: 'withdrawals', label: 'Withdrawals' },
  { key: 'idproofs', label: 'ID Proofs' },
  { key: 'deletions', label: 'Deletions' },
]

const CATEGORY_LABEL: Record<string, string> = {
  booking_issue: 'Booking issue',
  payment_issue: 'Payment issue',
  refund_issue: 'Refund issue',
  pro_behavior: 'Pro behaviour',
  app_bug: 'App bug',
  account: 'Account',
  low_rating: 'Low rating',
  other: 'Other',
}

const STEP_LABEL: Record<string, string> = {
  cart_viewed: 'Viewed cart',
  checkout_started: 'Started checkout',
  payment_initiated: 'Reached payment',
  payment_failed: 'Payment failed',
  paid: 'Paid',
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [tab, setTab] = useState<Tab>('stats')

  const [stats, setStats] = useState<Stats | null>(null)
  const [pros, setPros] = useState<Pro[]>([])
  const [deletions, setDeletions] = useState<DeletionRequest[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [idProofs, setIdProofs] = useState<IdProof[]>([])
  const [carts, setCarts] = useState<AbandonedCart[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)

  // Check existing session
  useEffect(() => {
    fetch('/api/admin/login').then(r => r.json()).then(d => {
      setAuthed(!!d.authed)
      setAuthChecking(false)
    }).catch(() => setAuthChecking(false))
  }, [])

  const signIn = async (password: string) => {
    setSigningIn(true)
    setPwError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwError(data?.error || 'Wrong password')
        setSigningIn(false)
        return
      }
      setPw('')
      setAuthed(true)
    } catch {
      setPwError('Network error')
    }
    setSigningIn(false)
  }

  const signOut = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (tab === 'stats') {
        const r = await fetch('/api/admin/stats')
        setStats(await r.json())
      } else if (tab === 'pros') {
        const r = await fetch('/api/admin/pros')
        const d = await r.json()
        setPros(d.pros || [])
      } else if (tab === 'deletions') {
        const r = await fetch('/api/admin/deletions')
        const d = await r.json()
        setDeletions(d.requests || [])
      } else if (tab === 'withdrawals') {
        const r = await fetch('/api/admin/withdrawals')
        const d = await r.json()
        setWithdrawals(d.requests || [])
      } else if (tab === 'idproofs') {
        const r = await fetch('/api/admin/idproofs')
        const d = await r.json()
        setIdProofs(d.professionals || [])
      } else if (tab === 'carts') {
        const r = await fetch('/api/admin/abandoned-carts?filter=open')
        const d = await r.json()
        setCarts(d.carts || [])
      } else if (tab === 'tickets') {
        const r = await fetch('/api/admin/tickets')
        const d = await r.json()
        setTickets(d.tickets || [])
      }
    } catch (err) {
      console.error('[admin] load error:', err)
    }
    setLoading(false)
  }, [tab])

  useEffect(() => { if (authed) load() }, [authed, tab, load])

  const proAction = async (id: string, action: 'approve' | 'delete') => {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Delete'} this professional?`)) return
    await fetch('/api/admin/pros', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    load()
  }

  const handleDeletion = async (id: string, professionalId: string, action: 'approve' | 'reject') => {
    if (!confirm(`${action === 'approve' ? 'Delete account' : 'Reject request'}?`)) return
    await fetch('/api/admin/deletions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, professionalId, action }),
    })
    load()
  }

  const handleWithdrawal = async (id: string, action: 'approve' | 'reject') => {
    const note = action === 'approve' ? 'Paid via UPI' : prompt('Rejection reason:') || ''
    await fetch('/api/admin/withdrawals', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, adminNote: note }),
    })
    load()
  }

  const verifyIdProof = async (id: string, verified: boolean) => {
    await fetch('/api/admin/idproofs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, verified }),
    })
    load()
  }

  const updateTicket = async (id: string, status: string, note?: string) => {
    await fetch('/api/admin/tickets', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminNote: note }),
    })
    load()
  }

  if (authChecking) {
    return <main className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">Loading…</main>
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form
          onSubmit={e => { e.preventDefault(); if (pw) signIn(pw) }}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl"
        >
          <span className="gradient-text font-black text-3xl tracking-tighter">zilpo</span>
          <p className="text-gray-400 text-sm mt-1 mb-6">Admin Panel</p>
          <input
            type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError('') }}
            placeholder="Admin password" autoFocus autoComplete="current-password"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#F5A623] mb-3"
          />
          {pwError && <p className="text-xs text-red-500 mb-3">{pwError}</p>}
          <button
            type="submit" disabled={!pw || signingIn}
            className="w-full bg-[#F5A623] text-white font-bold py-3 rounded-2xl disabled:opacity-50"
          >{signingIn ? 'Checking…' : 'Sign in'}</button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="gradient-text font-black text-2xl tracking-tighter">zilpo admin</span>
        <button onClick={signOut} className="text-xs text-gray-400 border border-gray-200 rounded-xl px-3 py-1.5">Sign out</button>
      </header>

      <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${tab === key ? 'bg-[#F5A623] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {label}
            {key === 'tickets' && stats && stats.openTickets > 0 && (
              <span className={`ml-2 px-1.5 rounded-md text-[10px] ${tab === key ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>{stats.openTickets}</span>
            )}
            {key === 'carts' && stats && stats.abandonedCarts > 0 && (
              <span className={`ml-2 px-1.5 rounded-md text-[10px] ${tab === key ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>{stats.abandonedCarts}</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-6 pb-8">
        {loading && <div className="text-center text-gray-400 py-12 text-sm">Loading…</div>}

        {tab === 'stats' && !loading && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Users', value: stats.users, color: '#4F46E5' },
              { label: 'Professionals', value: stats.professionals, color: '#7C3AED' },
              { label: 'Pending approval', value: stats.pendingPros, color: '#D97706' },
              { label: 'Total bookings', value: stats.totalBookings, color: '#059669' },
              { label: 'Total revenue', value: `₹${stats.totalRevenue}`, color: '#F5A623' },
              { label: 'Our earnings (20%)', value: `₹${stats.ourEarnings}`, color: '#EF4444' },
              { label: 'Open support tickets', value: stats.openTickets, color: '#DC2626' },
              { label: 'Abandoned carts', value: stats.abandonedCarts, color: '#B45309' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="font-extrabold text-2xl" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'tickets' && !loading && (
          <div className="flex flex-col gap-3">
            {tickets.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No tickets yet.</p>}
            {tickets.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {t.name || 'Anonymous'}
                      <span className="ml-2 text-xs font-medium text-gray-400 capitalize">· {t.source}</span>
                    </p>
                    <p className="text-xs text-gray-500">+91 {t.phone} · {CATEGORY_LABEL[t.category] || t.category}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(t.created_at)}{t.rating ? ` · ${t.rating}★` : ''}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${
                    t.status === 'open' ? 'bg-red-100 text-red-600' :
                    t.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>{t.status.replace('_', ' ')}</span>
                </div>
                {t.subject && <p className="text-sm font-semibold text-gray-800 mt-2">{t.subject}</p>}
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">{t.message}</p>
                {t.booking_id && (
                  <p className="text-xs text-gray-400 mt-2 font-mono">Booking: {t.booking_id.slice(0, 8)}…</p>
                )}
                {t.admin_note && (
                  <p className="text-xs text-blue-600 mt-2 bg-blue-50 rounded-lg p-2">Note: {t.admin_note}</p>
                )}
                {t.status !== 'closed' && (
                  <div className="flex gap-2 mt-3">
                    {t.status === 'open' && (
                      <button onClick={() => updateTicket(t.id, 'in_progress')}
                        className="flex-1 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl">
                        Take it
                      </button>
                    )}
                    <button onClick={() => {
                      const note = prompt('Resolution note (optional):') || ''
                      updateTicket(t.id, 'resolved', note)
                    }} className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl">
                      Resolve
                    </button>
                    <button onClick={() => updateTicket(t.id, 'closed')}
                      className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">
                      Close
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'carts' && !loading && (
          <div className="flex flex-col gap-3">
            {carts.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No abandoned carts.</p>}
            {carts.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{c.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{c.phone ? `+91 ${c.phone}` : 'No phone'} · {c.booking_mode || 'instant'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(c.updated_at)}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 bg-amber-100 text-amber-700">
                    {STEP_LABEL[c.last_step] || c.last_step}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  ₹{c.total || c.subtotal} · {(c.items || []).length} item{(c.items || []).length === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {(c.items || []).map(i => i.name).filter(Boolean).join(', ') || '—'}
                </p>
                {c.location?.address && (
                  <p className="text-xs text-gray-400 mt-1 truncate">📍 {c.location.address}</p>
                )}
                {c.promo_code && (
                  <p className="text-xs text-purple-600 mt-1">Promo: {c.promo_code}</p>
                )}
                {c.phone && (
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:+91${c.phone}`} className="flex-1 py-2 bg-[#F5A623] text-white text-xs font-bold rounded-xl text-center">
                      Call to recover
                    </a>
                    <a href={`https://wa.me/91${c.phone}?text=${encodeURIComponent('Hi, this is Zilpo. We saved your cart — finish booking with code ZILPO10 for 10% off.')}`}
                      target="_blank" rel="noreferrer"
                      className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl text-center">
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'pros' && !loading && (
          <div className="flex flex-col gap-3">
            {pros.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No professionals yet.</p>}
            {pros.map(pro => (
              <div key={pro.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{pro.name}</p>
                    <p className="text-sm text-gray-500">+91 {pro.phone} · {pro.service_type} · {pro.gender}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(pro.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${pro.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {pro.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {pro.status !== 'approved' && (
                    <button onClick={() => proAction(pro.id, 'approve')}
                      className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl">
                      Approve
                    </button>
                  )}
                  <button onClick={() => proAction(pro.id, 'delete')}
                    className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'withdrawals' && !loading && (
          <div className="flex flex-col gap-3">
            {withdrawals.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No withdrawal requests yet.</p>}
            {withdrawals.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{req.professionals?.name}</p>
                    <p className="text-sm text-gray-500">+91 {req.professionals?.phone}</p>
                    <p className="text-sm font-semibold text-[#F5A623] mt-1">₹{Math.round(req.amount)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">UPI: <span className="font-mono font-semibold">{req.upi_id}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{req.status}</span>
                </div>
                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleWithdrawal(req.id, 'approve')}
                      className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl">
                      Mark paid
                    </button>
                    <button onClick={() => handleWithdrawal(req.id, 'reject')}
                      className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'idproofs' && !loading && (
          <div className="flex flex-col gap-3">
            {idProofs.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No ID proofs uploaded yet.</p>}
            {idProofs.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-500">+91 {p.phone} · {p.service_type}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">Document: {p.id_proof_type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${p.id_proof_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.id_proof_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                {p.signed_url ? (
                  <a href={p.signed_url} target="_blank" rel="noopener noreferrer"
                    className="block w-full py-2 text-center text-xs font-bold text-blue-600 border border-blue-200 rounded-xl mb-2 bg-blue-50">
                    View document
                  </a>
                ) : (
                  <p className="text-xs text-gray-400 text-center mb-2">Document not available</p>
                )}
                <div className="flex gap-2">
                  {!p.id_proof_verified ? (
                    <button onClick={() => verifyIdProof(p.id, true)}
                      className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl">
                      Mark verified
                    </button>
                  ) : (
                    <button onClick={() => verifyIdProof(p.id, false)}
                      className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">
                      Unverify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'deletions' && !loading && (
          <div className="flex flex-col gap-3">
            {deletions.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">No pending deletion requests.</p>}
            {deletions.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="font-bold text-gray-900">{req.professionals?.name}</p>
                <p className="text-sm text-gray-500">+91 {req.professionals?.phone} · {req.professionals?.service_type}</p>
                <p className="text-xs text-gray-400 mt-1">Reason: {req.reason}</p>
                <p className="text-xs text-gray-300 mt-0.5">{new Date(req.created_at).toLocaleDateString('en-IN')}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleDeletion(req.id, req.professional_id, 'approve')}
                    className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-xl">
                    Delete account
                  </button>
                  <button onClick={() => handleDeletion(req.id, req.professional_id, 'reject')}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
