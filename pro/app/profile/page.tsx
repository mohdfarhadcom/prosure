'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import type { Lang } from '@/context/I18nContext'

export default function ProfilePage() {
  const { pro, setPro, logout, loading } = useAuth()
  const { t, lang, setLang, langLabels } = useI18n()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(pro?.name || '')
  const [saving, setSaving] = useState(false)
  const [showLangSheet, setShowLangSheet] = useState(false)
  const [showDeleteSheet, setShowDeleteSheet] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')
  const [submittingDelete, setSubmittingDelete] = useState(false)
  const [deleteRequested, setDeleteRequested] = useState(false)

  if (loading) return null
  if (!pro) { router.replace('/login'); return null }

  const saveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('professionals')
      .update({ name: name.trim() })
      .eq('id', pro.id)
      .select()
      .single()
    if (data) setPro({ ...pro, name: data.name })
    setSaving(false)
    setEditing(false)
  }

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  const submitDeletionRequest = async () => {
    if (!pro) return
    setSubmittingDelete(true)
    await fetch('/api/request-deletion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ professionalId: pro.id, reason: deleteReason || 'No reason provided' }),
    })
    setSubmittingDelete(false)
    setShowDeleteSheet(false)
    setDeleteRequested(true)
  }

  const serviceLabel = pro.service_type === 'home_help' ? t.homeHelp : t.homeCook

  return (
    <>
      <main className="page">
        <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4">
          <h1 className="font-bold text-xl text-gray-900">{t.profile}</h1>
        </header>

        {/* Avatar + name */}
        <div className="flex flex-col items-center px-4 pt-6 pb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF6B35] flex items-center justify-center text-white font-black text-2xl shadow-lg mb-3">
            {pro.name.charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-center outline-none focus:border-[#F5A623]"
                autoFocus
              />
              <button onClick={saveProfile} disabled={saving} className="text-xs text-[#F5A623] font-bold">
                {saving ? t.saving : t.save}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <p className="font-bold text-xl text-gray-900">{pro.name}</p>
              <button onClick={() => { setEditing(true); setName(pro.name) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-0.5">+91 {pro.phone}</p>

          {/* Approval badge */}
          <div className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${pro.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {pro.status === 'approved' ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t.approved}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {t.pendingApproval}
              </>
            )}
          </div>
        </div>

        {/* Settings list */}
        <div className="px-4 flex flex-col gap-2">
          {/* Service type */}
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFF3DC] rounded-xl flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t.serviceType}</p>
                <p className="text-sm font-semibold text-gray-900">{serviceLabel}</p>
              </div>
            </div>
          </div>

          {/* Language */}
          <button
            onClick={() => setShowLangSheet(true)}
            className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFF3DC] rounded-xl flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t.language}</p>
                <p className="text-sm font-semibold text-gray-900">{langLabels[lang]}</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Help */}
          <Link href="/help" className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFF3DC] rounded-xl flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">{t.help}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-50 rounded-2xl px-4 py-4 mt-2"
          >
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <p className="text-sm font-semibold text-red-600">{t.logout}</p>
          </button>

          {/* Delete account request */}
          {deleteRequested ? (
            <p className="text-center text-xs text-gray-400 mt-3 px-4">
              Account deletion request submitted. Admin will review it shortly.
            </p>
          ) : (
            <button
              onClick={() => setShowDeleteSheet(true)}
              className="text-center text-xs text-gray-400 mt-3 w-full py-2"
            >
              Request account deletion
            </button>
          )}
        </div>

        <div className="px-4 mt-8 pb-4 text-center">
          <span className="gradient-text font-black text-2xl tracking-tighter">zilpo</span>
          <p className="text-xs text-gray-400 mt-1">Professional v1.0</p>
          <p className="text-xs text-gray-300 mt-0.5">team@thezilpo.com</p>
        </div>
      </main>

      {/* Language bottom sheet */}
      {showLangSheet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-[430px] mx-auto" onClick={() => setShowLangSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-bold text-base mb-4">{t.language}</h3>
            {(Object.keys(langLabels) as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setShowLangSheet(false) }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1.5 transition-colors ${lang === l ? 'bg-[#FFF3DC] text-[#F5A623]' : 'bg-gray-50 text-gray-700'}`}
              >
                <span className="font-semibold text-sm">{langLabels[l]}</span>
                {lang === l && (
                  <div className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Navbar />

      {/* Deletion request bottom sheet */}
      {showDeleteSheet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-[430px] mx-auto" onClick={() => setShowDeleteSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-bold text-base mb-1 text-gray-900">Request account deletion</h3>
            <p className="text-xs text-gray-400 mb-4">Your account will be reviewed by admin before deletion.</p>
            <textarea
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              placeholder="Reason for leaving (optional)"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623] resize-none mb-4"
            />
            <button
              onClick={submitDeletionRequest}
              disabled={submittingDelete}
              className="w-full bg-red-500 text-white font-bold py-3.5 rounded-2xl disabled:opacity-50"
            >
              {submittingDelete ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
