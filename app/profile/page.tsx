'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
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

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setEmail(user.email || '')
    supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => {
      setAddresses((data || []) as Address[])
    })
  }, [user])

  const save = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('users').update({ name, email }).eq('id', user.id)
    setUser({ ...user, name, email })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    const confirmed = confirm('Delete your account permanently? All your data and bookings will be removed. This cannot be undone.')
    if (!confirmed) return
    setDeletingAccount(true)
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    if (res.ok) {
      await logout()
      router.push('/')
    } else {
      alert('Failed to delete account. Please contact support.')
    }
    setDeletingAccount(false)
  }

  if (!user) {
    return (
      <main className="page px-4 py-8">
        <h1 className="font-bold text-xl mb-6">Profile</h1>
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">Sign in to see your profile.</p>
          <Link href="/login?redirect=/profile" className="text-[#F5A623] font-semibold">Sign in</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page px-4 py-6">
      <h1 className="font-bold text-xl mb-6">Profile</h1>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Full name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Mobile</label>
          <input
            value={user.phone}
            disabled
            className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="bg-[#F5A623] text-white font-semibold py-4 rounded-2xl disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
        </button>
      </div>

      {/* Saved addresses */}
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
                <div>
                  <p className="text-xs font-semibold text-[#F5A623] mb-1">{a.label}</p>
                  <p className="text-sm text-gray-700">{a.full_address}</p>
                </div>
                <button onClick={() => deleteAddress(a.id)} className="text-gray-400 text-xs ml-3">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
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
          <span>Terms and conditions</span>
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
        Log out
      </button>

      <button
        onClick={handleDeleteAccount}
        disabled={deletingAccount}
        className="w-full text-red-400 text-xs py-3 disabled:opacity-50"
      >
        {deletingAccount ? 'Deleting account...' : 'Delete account'}
      </button>
    </main>
  )
}
