import { SERVICES } from './services'

export const SERVICE_FEE = 20
export const VISITING_FEE = 59
export const VISITING_FEE_THRESHOLD = 499
export const ALLOWED_TIPS = [0, 20, 50, 100]
export const MIN_AMOUNT = 0
export const MAX_AMOUNT = 50000

export type HourSlug = 'hourly-0.5' | 'hourly-1' | 'hourly-1.5' | 'hourly-2'

const HOURLY_PRICES: Record<string, { hours: number; price: number }> = {
  'hourly-0.5': { hours: 0.5, price: 49 },
  'hourly-1':   { hours: 1,   price: 99 },
  'hourly-1.5': { hours: 1.5, price: 149 },
  'hourly-2':   { hours: 2,   price: 189 },
}

export type CartLine = { slug: string; quantity?: number }

export type PriceQuote = {
  ok: true
  subtotal: number
  visitingFee: number
  surgeFee: number
  surgeLabel: string
  serviceFee: number
  promoDiscount: number
  tip: number
  total: number
  durationMinutes: number
  isHourly: boolean
}

export type PriceError = { ok: false; error: string }

export function getSurge(now: Date = new Date()): { fee: number; label: string } {
  // Convert to IST regardless of server TZ
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const h = ist.getHours()
  const d = ist.getDay()
  const weekend = d === 0 || d === 6
  const peak = (h >= 7 && h < 10) || (h >= 17 && h < 21)
  if (peak && weekend) return { fee: 50, label: 'Weekend peak surge' }
  if (peak) return { fee: 30, label: 'Peak hours surge' }
  if (weekend) return { fee: 20, label: 'Weekend surge' }
  return { fee: 0, label: '' }
}

const PROMOS = {
  ZILPO10: { type: 'percent' as const, value: 10 },
  // Internal test promo — full discount.
  'OwbhnsJue736+#;jhe': { type: 'percent' as const, value: 100 },
}

export function applyPromo(code: string | null | undefined, subtotal: number): { discount: number; label: string | null } {
  if (!code) return { discount: 0, label: null }
  const trimmed = code.trim()
  if (!trimmed) return { discount: 0, label: null }
  // Case-sensitive for the internal code, case-insensitive for public.
  const upper = trimmed.toUpperCase()
  const promo = (PROMOS as Record<string, { type: 'percent'; value: number }>)[upper] || (PROMOS as Record<string, { type: 'percent'; value: number }>)[trimmed]
  if (!promo) return { discount: 0, label: null }
  return {
    discount: Math.min(subtotal, Math.round((subtotal * promo.value) / 100)),
    label: upper === 'ZILPO10' ? 'ZILPO10' : 'TEST',
  }
}

export function quote(input: {
  items: CartLine[]
  tip?: number
  promoCode?: string | null
  now?: Date
}): PriceQuote | PriceError {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: 'Cart is empty' }
  }
  if (input.items.length > 50) {
    return { ok: false, error: 'Too many items' }
  }

  const tip = ALLOWED_TIPS.includes(Number(input.tip)) ? Number(input.tip) : 0

  let subtotal = 0
  let durationMinutes = 60
  let isHourly = false

  const hourly = input.items.find(i => i.slug?.startsWith('hourly-'))
  if (hourly) {
    if (input.items.length > 1) return { ok: false, error: 'Hourly bookings cannot be combined with other services' }
    const meta = HOURLY_PRICES[hourly.slug]
    if (!meta) return { ok: false, error: 'Unknown hourly tier' }
    subtotal = meta.price
    durationMinutes = Math.round(meta.hours * 60)
    isHourly = true
  } else {
    for (const line of input.items) {
      const svc = SERVICES.find(s => s.slug === line.slug)
      if (!svc) return { ok: false, error: `Unknown service: ${line.slug}` }
      const qty = Math.max(1, Math.min(5, Math.floor(Number(line.quantity || 1))))
      subtotal += svc.base * qty
      durationMinutes = Math.max(durationMinutes, svc.duration)
    }
  }

  const visitingFee = subtotal < VISITING_FEE_THRESHOLD ? VISITING_FEE : 0
  const surge = getSurge(input.now)
  const { discount, label } = applyPromo(input.promoCode, subtotal)
  const isFreePromo = label === 'TEST'

  const beforePromo = subtotal + visitingFee + surge.fee + SERVICE_FEE + tip
  const total = isFreePromo ? 0 : Math.max(0, beforePromo - discount)

  if (total < MIN_AMOUNT || total > MAX_AMOUNT) {
    return { ok: false, error: 'Invalid total' }
  }

  return {
    ok: true,
    subtotal,
    visitingFee,
    surgeFee: surge.fee,
    surgeLabel: surge.label,
    serviceFee: SERVICE_FEE,
    promoDiscount: isFreePromo ? beforePromo : discount,
    tip,
    total,
    durationMinutes,
    isHourly,
  }
}
