import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy – Zilpo' }

export default function PrivacyPage() {
  return (
    <main className="page px-4 py-6">
      <Link href="/profile" className="text-sm text-[#F5A623] mb-4 block">← Back</Link>
      <h1 className="font-bold text-2xl mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: May 2026</p>

      {[
        {
          title: 'Data we collect',
          body: 'We collect your mobile number for authentication. We collect your name and email if you provide them. We collect location data to match you with nearby professionals. We collect booking and payment transaction data to provide the service.',
        },
        {
          title: 'How we use your data',
          body: 'To connect you with professionals near you. To process bookings and payments. To send booking confirmations and updates via SMS or email. We do not sell your personal data to third parties.',
        },
        {
          title: 'Location',
          body: 'Location is used to find nearby workers and calculate your service area. Your approximate location is used only during the booking process and is not stored permanently after a session ends.',
        },
        {
          title: 'Payments',
          body: 'Payments are processed securely by Razorpay. We do not store your card number, CVV, or UPI ID. We only store the Razorpay payment reference ID for booking records. An 80/20 payment split applies: 80% goes to the professional (held for 7 days after service) and 20% is the Zilpo platform fee.',
        },
        {
          title: 'Identity documents (professionals)',
          body: 'Professionals are required to upload a government-issued ID (Aadhaar, PAN, Voter ID, or Ration Card) during registration. This document is stored securely and privately. It is never shared with customers. It will only be disclosed to law enforcement authorities if legally required (for example, for a verified police inquiry or court order). Professionals can request a copy of their stored document at any time.',
        },
        {
          title: 'Communications',
          body: 'We send OTP codes via SMS for login. We may send booking confirmation and status updates via email. You can opt out of non-essential messages by contacting us.',
        },
        {
          title: 'Data retention',
          body: 'Booking records are retained for up to 3 years for accounting and dispute resolution purposes. ID documents uploaded by professionals are retained as long as the professional account is active and for 1 year after deletion.',
        },
        {
          title: 'Your rights',
          body: 'You can request deletion of your account and personal data by emailing team@thezilpo.com. We will process account deletion within 7 working days. Note that some data may be retained as required by law.',
        },
        {
          title: 'Contact',
          body: 'For any privacy concerns: team@thezilpo.com | +91 99353 67449',
        },
      ].map(({ title, body }) => (
        <div key={title} className="mb-6">
          <h2 className="font-semibold text-sm mb-2">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </main>
  )
}
