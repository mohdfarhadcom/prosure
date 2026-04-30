'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type CartItem = {
  slug: string
  name: string
  price: number
  original: number
  qty: number
}

type CartCtx = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>) => void
  remove: (slug: string) => void
  clear: () => void
  total: number
  count: number
}

const Ctx = createContext<CartCtx>({
  items: [], add: () => {}, remove: () => {}, clear: () => {}, total: 0, count: 0,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const s = localStorage.getItem('zilpo_cart')
      if (s) setItems(JSON.parse(s))
    } catch {}
  }, [])

  const save = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('zilpo_cart', JSON.stringify(next))
  }

  const add = (item: Omit<CartItem, 'qty'>) => {
    setItems(prev => {
      const exists = prev.find(i => i.slug === item.slug)
      const next = exists
        ? prev.map(i => i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }]
      localStorage.setItem('zilpo_cart', JSON.stringify(next))
      return next
    })
  }

  const remove = (slug: string) => {
    const next = items.filter(i => i.slug !== slug)
    save(next)
  }

  const clear = () => save([])

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return <Ctx.Provider value={{ items, add, remove, clear, total, count }}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
