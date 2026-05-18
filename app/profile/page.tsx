'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

type Address = { id: string; label: string; full_address: string }

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setEmail(user.email || '')
    fetch('/api/addresses').then(r => r.json()).then(d => setAddresses(d.addresses || [])).catch(() => {})
  }, [user])

  const save = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Could not save')
      } else {
        setUser({ ...user, name: data.user?.name || '', email: data.user?.email || '' })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      setError('Network error')
    }
    setSaving(false)
  }

  const deleteAddress = async (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    await fetch(`/api/addresses?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }).catch(() => {})
    await logout()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    const confirmed = confirm('Delete your account? Saved addresses are removed and your profile is wiped. Past bookings stay on record for receipts and disputes.')
    if (!confirmed) return
    setDeletingAccount(true)
    const res = await fetch('/api/delete-account', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      await logout()
      router.push('/')
    } else {
      alert(data?.error || 'Could not delete account. Please contact support.')
    }
    setDeletingAccount(false)
  }

  if (!user) {
    return (
      <main className="page px-4 py-8">
        <h1 className="font-bold text-xl mb-6">Your profile</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm mb-4">Sign in to manage your profile.</p>
          <Link href="/login?redirect=/profile" className="text-[#F5A623] font-semibold">Sign in</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page px-4 py-6">
      <h1 className="font-bold text-xl mb-6">Your profile</h1>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Full name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email (for receipts)</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            maxLength={200}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Mobile</label>
          <input
            value={user.phone}
            disabled
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="bg-[#F5A623] text-white font-semibold py-4 rounded-2xl disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Saved addresses</h2>
          <Link href="/location" className="text-[#F5A623] text-xs font-semibold">+ Add</Link>
        </div>
        {addresses.length === 0 ? (
          <p className="text-gray-400 text-sm">No saved addresses.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map(a => (
              <div key={a.id} className="flex items-start justify-between bg-gray-50 rounded-xl p-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F5A623] mb-1">{a.label}</p>
                  <p className="text-sm text-gray-700 break-words">{a.full_address}</p>
                </div>
                <button onClick={() => deleteAddress(a.id)} className="text-gray-400 text-xs ml-3 flex-shrink-0">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <Link href="/bookings" className="flex items-center justify-between py-3 border-b border-gray-50 text-sm">
          <span>My bookings</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
        <Link href="/help" className="flex items-center justify-between py-3 border-b border-gray-50 text-sm">
          <span>Help and support</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
        <Link href="/terms" className="flex items-center justify-between py-3 border-b border-gray-50 text-sm">
          <span>Terms of service</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
        <Link href="/privacy" className="flex items-center justify-between py-3 border-b border-gray-50 text-sm">
          <span>Privacy policy</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="w-full border border-red-200 text-red-500 font-semibold py-4 rounded-2xl mb-3"
      >
        Sign out
      </button>

      <button
        onClick={handleDeleteAccount}
        disabled={deletingAccount}
        className="w-full text-red-400 text-xs py-3 disabled:opacity-50"
      >
        {deletingAccount ? 'Deleting your account…' : 'Delete account'}
      </button>
    </main>
  )
}
