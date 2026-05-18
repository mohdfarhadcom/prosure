import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms and Conditions – Zilpo' }

export default function TermsPage() {
  return (
    <main className="page px-4 py-6">
      <Link href="/profile" className="text-sm text-[#F5A623] mb-4 block">← Back</Link>
      <h1 className="font-bold text-2xl mb-2">Terms and Conditions</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: May 2026</p>

      {[
        {
          title: 'The service',
          body: 'Zilpo (thezilpo.com) connects customers with independent home service professionals. Zilpo is a technology platform and marketplace — not the employer of the professionals listed on the platform.',
        },
        {
          title: 'Bookings and payments',
          body: 'Bookings are confirmed once payment is complete. Zilpo charges a 20% platform fee on each booking. The remaining 80% is earned by the professional. Prices shown are inclusive of all charges including a ₹20 service fee and any applicable visiting fee.',
        },
        {
          title: 'Payment hold period',
          body: 'Professional earnings are held for 7 days after service completion before being released to their wallet. This hold protects customers against disputes and fraud. After 7 days, funds are released automatically.',
        },
        {
          title: 'Cancellations and refunds',
          body: 'Full refund if you cancel 3 or more hours before the booking. No refund for cancellations within 3 hours unless the professional cancels first. Full refund if we cannot find a professional within 15 minutes for instant bookings. Refunds are processed within 5–7 business days to the original payment method.',
        },
        {
          title: 'Damage policy',
          body: 'Zilpo covers accidental damage up to ₹6,000 per booking for verified claims. This does not apply to bookings made with promo codes. Claims must be raised within 24 hours of service completion by emailing team@thezilpo.com.',
        },
        {
          title: 'Identity verification of professionals',
          body: 'All professionals are required to submit a government-issued ID (Aadhaar Card, PAN Card, Voter ID, or Ration Card) as part of their registration. This information is stored securely and is only accessed when required by law enforcement or for a legitimate safety investigation. Customers never have access to this information.',
        },
        {
          title: 'Professional conduct',
          body: 'Professionals must not share their personal contact details with customers or arrange off-platform bookings. Customers must not solicit professionals directly to bypass the platform. Zilpo may remove professionals for policy violations.',
        },
        {
          title: 'Prohibited use',
          body: 'You may not use Zilpo for any unlawful purpose, misrepresent your identity, post false reviews, or engage in fraudulent activity.',
        },
        {
          title: 'Limitation of liability',
          body: 'Zilpo is not liable for indirect or consequential losses. Our maximum liability for any claim is limited to the amount paid for the specific booking in question.',
        },
        {
          title: 'Changes to terms',
          body: 'We may update these terms from time to time. Continued use of the service after updates constitutes acceptance of the revised terms.',
        },
        {
          title: 'Contact',
          body: 'team@thezilpo.com | +91 9058172570',
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
