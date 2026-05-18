import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Professional Terms and Conditions – Zilpo' }

const sections = [
  {
    title: 'Agreement to terms',
    body: 'By registering as a professional on Zilpo, you agree to these terms in full. These terms form a binding agreement between you and Zilpo Technologies. If you do not agree, do not register or use the platform.',
  },
  {
    title: 'Platform relationship',
    body: 'Zilpo is a marketplace that connects independent service professionals with customers. You are an independent contractor, not an employee of Zilpo. You are solely responsible for your taxes, insurance, and legal compliance. Zilpo does not direct or control how you perform services.',
  },
  {
    title: 'Eligibility',
    body: 'You must be at least 18 years old. You must have the legal right to work in India. You must hold any licences or certifications required for the services you offer. Zilpo may verify your identity and background at any time.',
  },
  {
    title: 'Earnings and payouts',
    body: 'You receive 80% of the service price for every completed booking. Zilpo retains a 20% platform fee. Your earnings are held in your Zilpo wallet for 7 days after service completion as a customer protection measure. After 7 days, funds are released to your available balance and you can withdraw to your UPI account. Withdrawal requests are processed within 24 hours. Zilpo may withhold payout if a dispute or chargeback is raised.',
  },
  {
    title: 'Identity verification',
    body: 'You are required to upload a government-issued ID (Aadhaar Card, PAN Card, Voter ID, or Ration Card) during signup. This is stored securely and privately. It will only be shared with law enforcement if legally required. You can request your stored document by emailing team@thezilpo.com.',
  },
  {
    title: 'Accepted bookings',
    body: 'Once you accept a booking you must arrive on time and complete the service. Cancelling accepted bookings repeatedly may result in account suspension. You must contact Zilpo support immediately if an emergency prevents attendance.',
  },
  {
    title: 'Service standards',
    body: 'You must perform all services professionally, safely, and to a reasonable standard. You must bring all required tools and materials unless the customer has specifically agreed to provide them. You must leave the work area clean and tidy upon completion.',
  },
  {
    title: 'Customer conduct',
    body: 'You must treat every customer with respect and professionalism. Any form of harassment, discrimination, or inappropriate behaviour will result in immediate removal from the platform. Zilpo takes customer safety seriously and may share information with law enforcement when required.',
  },
  {
    title: 'Direct solicitation prohibited',
    body: 'You must not share your personal phone number, social handles, or payment details with customers to arrange off-platform bookings. Violations will result in permanent removal and may incur financial penalties equal to the platform fee on estimated off-platform revenue.',
  },
  {
    title: 'Damage and incidents',
    body: 'You are responsible for accidental damage caused during a service. Zilpo provides limited cover up to Rs 6,000 per incident for verified claims. You must report any incident to Zilpo within 2 hours of the service ending. You may not make direct payment arrangements with customers for damage without Zilpo approval.',
  },
  {
    title: 'Account suspension and termination',
    body: 'Zilpo may suspend or terminate your account for repeated cancellations, customer complaints, policy violations, or fraudulent activity. You may appeal a suspension by emailing team@thezilpo.com within 7 days. Zilpo\'s decision after review is final.',
  },
  {
    title: 'Ratings and reviews',
    body: 'Customers rate services after completion. Ratings affect your visibility and booking priority on the platform. You may not ask customers to remove or change genuine reviews. Fake reviews will result in account removal.',
  },
  {
    title: 'Confidentiality',
    body: 'You must keep all customer information confidential. You must not use customer data for any purpose other than completing the booked service. Data protection obligations continue after your account is closed.',
  },
  {
    title: 'Intellectual property',
    body: 'All content on the Zilpo platform is owned by Zilpo. You may not reproduce, copy, or distribute any part of the platform without written permission.',
  },
  {
    title: 'Changes to terms',
    body: 'Zilpo may update these terms from time to time. We will notify you via the app or email. Continued use of the platform after the update means you accept the new terms.',
  },
  {
    title: 'Governing law',
    body: 'These terms are governed by the laws of India. Any disputes will be resolved under the jurisdiction of the courts of New Delhi.',
  },
  {
    title: 'Contact',
    body: 'For any questions regarding these terms: team@thezilpo.com | +91 9058172570',
  },
]

export default function ProfessionalTermsPage() {
  return (
    <main className="page px-4 py-6">
      <Link href="/" className="text-sm text-[#F5A623] mb-4 block">← Back</Link>

      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623] bg-[#FFF3DC] px-2 py-1 rounded-md">For Professionals</span>
        <h1 className="font-bold text-2xl mt-2 mb-1">Terms and Conditions</h1>
        <p className="text-xs text-gray-400">Last updated: May 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <p className="text-xs text-amber-800 leading-relaxed">
          These terms apply specifically to professionals listed on the Zilpo platform. For customer terms, see our <Link href="/terms" className="underline font-semibold">Customer Terms</Link>.
        </p>
      </div>

      {sections.map(({ title, body }) => (
        <div key={title} className="mb-6">
          <h2 className="font-semibold text-sm mb-2">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </main>
  )
}
