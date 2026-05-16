import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms and Conditions – Zilpo' }

export default function TermsPage() {
  return (
    <main className="page px-4 py-6">
      <Link href="/profile" className="text-sm text-[#F5A623] mb-4 block">Back</Link>
      <h1 className="font-bold text-2xl mb-2">Terms and Conditions</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: April 2026</p>

      {[
        { title: 'The service', body: 'Zilpo connects customers with independent home service professionals. Zilpo is a platform. We are not the employer of the professionals.' },
        { title: 'Bookings', body: 'Bookings are confirmed once payment is complete. Zilpo charges a 20% platform fee. The remaining 80% goes to the professional. Prices shown are inclusive of all charges.' },
        { title: 'Cancellations and refunds', body: 'Full refund if you cancel 3 or more hours before the booking. No refund for cancellations within 3 hours. Full refund if the professional cancels. Refunds are processed within 5-7 business days.' },
        { title: 'Damage policy', body: 'Zilpo covers accidental damage up to Rs 6,000 per booking. This does not apply to bookings made with promo codes. Claims must be raised within 24 hours of service completion.' },
        { title: 'Professional conduct', body: 'Professionals must not share personal contact details with customers. Customers must not attempt to bypass the platform for future bookings. Zilpo may remove professionals for policy violations.' },
        { title: 'Prohibited use', body: 'You may not use Zilpo for any unlawful purpose. You may not misrepresent your identity. You may not post false reviews or fraudulent content.' },
        { title: 'Limitation of liability', body: 'Zilpo is not liable for indirect losses. Maximum liability is limited to the amount paid for the specific booking in question.' },
        { title: 'Contact', body: 'team@thezilpo.com | +91 98100 40589' },
      ].map(({ title, body }) => (
        <div key={title} className="mb-6">
          <h2 className="font-semibold text-sm mb-2">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
      ))}
    </main>
  )
}
