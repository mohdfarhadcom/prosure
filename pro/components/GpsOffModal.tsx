'use client'
import { useState } from 'react'

export default function GpsOffModal({ onDismiss, onRetry, retrying }: {
  onDismiss: () => void
  onRetry: () => void
  retrying: boolean
}) {
  const [settingsOpened, setSettingsOpened] = useState(false)

  const handleTurnOn = () => {
    try {
      window.open(
        'intent://settings/LOCATION_SOURCE_SETTINGS#Intent;scheme=android-app;package=com.android.settings;action=android.settings.LOCATION_SOURCE_SETTINGS;end',
        '_blank'
      )
    } catch {}
    setSettingsOpened(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <p className="text-sm text-gray-800 leading-relaxed mb-4">
            To go online, your device needs <strong>Location</strong> turned on.
          </p>
          <p className="text-xs font-semibold text-gray-500 mb-3">Make sure these are enabled:</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">Device location</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Location Accuracy</p>
                <p className="text-xs text-gray-500 mt-0.5">Uses GPS, Wi‑Fi and mobile networks.</p>
              </div>
            </div>
          </div>
          {settingsOpened && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-xs text-blue-700">Enable Location in Settings, then tap <strong>Turn on</strong> again.</p>
            </div>
          )}
        </div>
        <div className="flex border-t border-gray-100">
          <button onClick={onDismiss} className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            No thanks
          </button>
          <div className="w-px bg-gray-100" />
          <button onClick={settingsOpened ? onRetry : handleTurnOn} disabled={retrying}
            className="flex-1 py-3.5 text-sm font-bold text-[#1a73e8] hover:bg-blue-50 disabled:opacity-50">
            {retrying ? 'Detecting...' : 'Turn on'}
          </button>
        </div>
      </div>
    </div>
  )
}
