'use client'
import { useState, useEffect, useCallback } from 'react'

const ADMIN_KEY = 'zilpo@admin2024'

type Stats = { users: number; professionals: number; pendingPros: number; totalRevenue: number; ourEarnings: number; totalBookings: number }
type Pro = { id: string; name: string; phone: string; service_type: string; gender: string; status: string; created_at: string }
type DeletionRequest = { id: string; professional_id: string; reason: string; created_at: string; professionals: { name: string; phone: string; service_type: string } }
type WithdrawalRequest = { id: string; professional_id: string; amount: number; upi_id: string; status: string; created_at: string; professionals: { name: string; phone: string } }
type IdProof = { id: string; name: string; phone: string; service_type: string; id_proof_type: string; id_proof_url: string; signed_url?: string; id_proof_verified: boolean; created_at: string }

type Tab = 'stats' | 'pros' | 'deletions' | 'withdrawals' | 'idproofs'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<Tab>('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [pros, setPros] = useState<Pro[]>([])
  const [deletions, setDeletions] = useState<DeletionRequest[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [idProofs, setIdProofs] = useState<IdProof[]>([])
  const [loading, setLoading] = useState(false)

  const headers = { 'x-admin-key': ADMIN_KEY }

  const load = useCallback(async () => {
    setLoading(true)
    if (tab === 'stats') {
      const r = await fetch('/api/admin/stats', { headers })
      setStats(await r.json())
    } else if (tab === 'pros') {
      const r = await fetch('/api/admin/pros', { headers })
      const d = await r.json()
      setPros(d.pros || [])
    } else if (tab === 'deletions') {
      const r = await fetch('/api/admin/deletions', { headers })
      const d = await r.json()
      setDeletions(d.requests || [])
    } else if (tab === 'withdrawals') {
      const r = await fetch('/api/admin/withdrawals', { headers })
      const d = await r.json()
      setWithdrawals(d.requests || [])
    } else if (tab === 'idproofs') {
      const r = await fetch('/api/admin/idproofs', { headers })
      const d = await r.json()
      setIdProofs(d.professionals || [])
    }
    setLoading(false)
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (authed) load() }, [authed, tab, load])

  const proAction = async (id: string, action: 'approve' | 'delete') => {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Delete'} this professional?`)) return
    await fetch('/api/admin/pros', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) })
    load()
  }

  const handleDeletion = async (id: string, professionalId: string, action: 'approve' | 'reject') => {
    if (!confirm(`${action === 'approve' ? 'Delete account' : 'Reject request'}?`)) return
    await fetch('/api/admin/deletions', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, professionalId, action }) })
    load()
  }

  const handleWithdrawal = async (id: string, action: 'approve' | 'reject') => {
    const note = action === 'approve' ? 'Paid via UPI' : prompt('Rejection reason:') || ''
    await fetch('/api/admin/withdrawals', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action, adminNote: note }) })
    load()
  }

  const verifyIdProof = async (id: string, verified: boolean) => {
    await fetch('/api/admin/idproofs', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, verified }) })
    load()
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'stats', label: 'Stats' },
    { key: 'pros', label: 'Pros' },
    { key: 'withdrawals', label: 'Withdrawals' },
    { key: 'idproofs', label: 'ID Proofs' },
    { key: 'deletions', label: 'Deletions' },
  ]

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
          <span className="gradient-text font-black text-3xl tracking-tighter">zilpo</span>
          <p className="text-gray-400 text-sm mt-1 mb-6">Admin Panel</p>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Admin password" autoFocus
            onKeyDown={e => e.key === 'Enter' && pw === ADMIN_KEY && setAuthed(true)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#F5A623] mb-4"
          />
          <button
            onClick={() => { if (pw === ADMIN_KEY) setAuthed(true); else alert('Wrong password') }}
            className="w-full bg-[#F5A623] text-white font-bold py-3 rounded-2xl"
          >Enter</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="gradient-text font-black text-2xl tracking-tighter">zilpo admin</span>
        <button onClick={() => setAuthed(false)} className="text-xs text-gray-400 border border-gray-200 rounded-xl px-3 py-1.5">Logout</button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${tab === key ? 'bg-[#F5A623] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-8">
        {loading && <div className="text-center text-gray-400 py-12 text-sm">Loading...</div>}

        {/* Stats */}
        {tab === 'stats' && !loading && stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Users', value: stats.users, color: '#4F46E5' },
              { label: 'Professionals', value: stats.professionals, color: '#7C3AED' },
              { label: 'Pending Approval', value: stats.pendingPros, color: '#D97706' },
              { label: 'Total Bookings', value: stats.totalBookings, color: '#059669' },
              { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, color: '#F5A623' },
              { label: 'Our Earnings (20%)', value: `₹${stats.ourEarnings}`, color: '#EF4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="font-extrabold text-2xl" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pros */}
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

        {/* Withdrawals */}
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
                      Mark Paid
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

        {/* ID Proofs */}
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
                <a
                  href={p.signed_url || p.id_proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 text-center text-xs font-bold text-blue-600 border border-blue-200 rounded-xl mb-2 bg-blue-50"
                >
                  View Document
                </a>
                <div className="flex gap-2">
                  {!p.id_proof_verified && (
                    <button onClick={() => verifyIdProof(p.id, true)}
                      className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-xl">
                      Mark Verified
                    </button>
                  )}
                  {p.id_proof_verified && (
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

        {/* Deletion Requests */}
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
                    Delete Account
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
