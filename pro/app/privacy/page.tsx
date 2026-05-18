import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy – Zilpo Professional' }

const sections = [
  {
    title: 'Who this policy applies to',
    body: 'This policy explains how Zilpo Technologies collects, uses, and protects the personal data of registered service professionals on the Zilpo platform.',
  },
  {
    title: 'Data we collect',
    body: 'We collect your full name, mobile number, and email address during registration. We collect your government-issued ID and proof of address for identity verification. We collect your service category, skills, and experience details for profile creation. We collect your bank account or UPI details to process earnings payouts. We collect location data when you are active on the platform to match you with nearby bookings.',
  },
  {
    title: 'Identity verification and ID documents',
    body: 'All professionals are required to upload a government-issued ID (Aadhaar Card, PAN Card, Voter ID, or Ration Card) during registration. This document is stored securely and privately in our system. It is never shared with customers. It will only be disclosed to law enforcement authorities if legally required — for example, in response to a verified police inquiry or court order. You can request access to your stored document at any time by emailing team@thezilpo.com.',
  },
  {
    title: 'How we use your data',
    body: 'To create and manage your professional profile on the platform. To match you with customer bookings based on your location, skills, and availability. To process your earnings and manage payouts. To send you booking notifications and service alerts via SMS or app notification. To investigate complaints, disputes, or damage claims involving your bookings. To improve the platform and personalise your experience.',
  },
  {
    title: 'Location data',
    body: 'We collect your real-time location only when you are marked as available in the app. Location data is used solely to show relevant nearby bookings and to provide customers with an estimated arrival time. We do not continuously track your location when you are offline or unavailable. Precise location history is retained for up to 30 days for dispute resolution purposes only.',
  },
  {
    title: 'Earnings and payment data',
    body: 'Your bank account or UPI details are stored securely and encrypted. Payment processing is handled by Razorpay. Zilpo does not store full account numbers. Earnings records and payout history are retained for 7 years as required by Indian tax regulations.',
  },
  {
    title: 'Sharing your data',
    body: 'We share your first name, service rating, and service category with customers when you are matched to a booking. We do not share your phone number, address, or financial details with customers. We may share data with law enforcement or regulatory authorities if required by law or to investigate fraud. We do not sell your personal data to third parties for marketing purposes.',
  },
  {
    title: 'Profile visibility',
    body: 'Your professional profile (name, photo if provided, rating, and service category) is visible to customers on the platform. You can update your profile details at any time through the app. If you deactivate your account, your profile is hidden from customers but retained in our systems for 12 months before permanent deletion.',
  },
  {
    title: 'Data retention',
    body: 'Active account data is retained for as long as your account is in use. After account closure, personal data is deleted within 12 months except where retention is required by law. Dispute and incident records may be retained for up to 3 years.',
  },
  {
    title: 'Security',
    body: 'We use industry-standard encryption for data in transit and at rest. Access to professional data within Zilpo is restricted to authorised staff. We conduct regular security audits of our systems. In the event of a data breach affecting your account, we will notify you within 72 hours.',
  },
  {
    title: 'Your rights',
    body: 'You have the right to access a copy of the personal data we hold about you. You have the right to correct inaccurate data. You have the right to request deletion of your account and associated data. To exercise any of these rights, email team@thezilpo.com. We will respond within 7 working days.',
  },
  {
    title: 'Changes to this policy',
    body: 'We may update this policy as the platform evolves. We will notify you of significant changes via the app or email at least 7 days before they take effect. Continued use of the platform after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact',
    body: 'For privacy-related queries or to exercise your rights: team@thezilpo.com | +91 9058172570',
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-white max-w-[430px] mx-auto px-5 py-6">
      <Link href="/login" className="text-sm text-[#F5A623] mb-5 block">← Back</Link>

      <div className="mb-6">
        <span className="gradient-text font-black text-2xl tracking-tighter">zilpo</span>
        <p className="text-[10px] text-gray-400 mb-3">Professional</p>
        <h1 className="font-bold text-2xl text-gray-900 mb-1">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: May 2026</p>
      </div>

      {sections.map(({ title, body }) => (
        <div key={title} className="mb-6">
          <h2 className="font-semibold text-sm text-gray-900 mb-1.5">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
        </div>
      ))}

      <div className="mt-4 mb-10">
        <Link href="/login" className="w-full block text-center bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-sm shadow-[0_4px_20px_rgba(245,166,35,0.35)]">
          Back to login
        </Link>
      </div>
    </main>
  )
}
