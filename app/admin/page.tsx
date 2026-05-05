'use client'
import { useState, useEffect, useCallback } from 'react'

const ADMIN_KEY = 'zilpo@admin2024'

type Stats = { users: number; professionals: number; pendingPros: number; totalRevenue: number; ourEarnings: number; totalBookings: number }
type Pro = { id: string; name: string; phone: string; service_type: string; gender: string; status: string; created_at: string }
type DeletionRequest = { id: string; professional_id: string; reason: string; created_at: string; professionals: { name: string; phone: string; service_type: string } }

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'stats' | 'pros' | 'deletions'>('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [pros, setPros] = useState<Pro[]>([])
  const [deletions, setDeletions] = useState<DeletionRequest[]>([])
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
    } else {
      const r = await fetch('/api/admin/deletions', { headers })
      const d = await r.json()
      setDeletions(d.requests || [])
    }
    setLoading(false)
  }, [tab])

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
      <div className="flex gap-2 px-6 py-4">
        {(['stats', 'pros', 'deletions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-[#F5A623] text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {t === 'deletions' ? 'Deletion Requests' : t.charAt(0).toUpperCase() + t.slice(1)}
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
