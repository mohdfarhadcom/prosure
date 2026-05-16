import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy – Zilpo' }

export default function PrivacyPage() {
  return (
    <main className="page px-4 py-6">
      <Link href="/profile" className="text-sm text-[#F5A623] mb-4 block">Back</Link>
      <h1 className="font-bold text-2xl mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: April 2026</p>

      {[
        { title: 'Data we collect', body: 'We collect your mobile number for login. We collect your name and email if you provide them. We collect location data to match you with nearby professionals. We collect booking and payment data to provide the service.' },
        { title: 'How we use data', body: 'To connect you with professionals near you. To process bookings and payments. To send booking updates via SMS. We do not sell your data to third parties.' },
        { title: 'Location', body: 'Location is used to show nearby workers and calculate service area. Location data is not stored permanently after a session ends.' },
        { title: 'Payments', body: 'Payments are processed by Razorpay. We do not store card numbers or UPI IDs. We only store the payment reference for booking records.' },
        { title: 'Communications', body: 'We send OTP codes via SMS. We may send booking status updates. You can opt out of non-essential messages by contacting us.' },
        { title: 'Your rights', body: 'You can request deletion of your account and data by emailing team@thezilpo.com. We will process deletion within 7 working days.' },
        { title: 'Contact', body: 'For any privacy concerns: team@thezilpo.com or +91 98100 40589.' },
      ].map(({ title, body }) => (
        <div key={title} className="mb-6">
          <h2 className="font-semibold text-sm mb-2">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </main>
  )
}
