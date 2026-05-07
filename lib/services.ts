export const SERVICES = [
  { slug: 'bathroom-cleaning', name: 'Bathroom Cleaning', base: 49, original: 125, duration: 40, category: 'cleaning', desc: 'Deep clean of bathroom. Tiles, toilet, sink, mirror.', img: '/services/bathroom-cleaning.jpg', rating: 4.9, reviews: 28400, isNew: false },
  { slug: 'fridge-cleaning', name: 'Fridge Cleaning', base: 149, original: 250, duration: 60, category: 'cleaning', desc: 'Inside and outside. Shelves, drawers, seals.', img: '/services/fridge-cleaning.jpg', rating: 4.9, reviews: 18600, isNew: false },
  { slug: 'packing-unpacking', name: 'Packing / Unpacking', base: 49, original: 125, duration: 90, category: 'moving', desc: 'Careful packing and unpacking of household items.', img: '/services/packing-unpacking.jpg', rating: 5.0, reviews: 3500, isNew: true },
  { slug: 'utensils-cleaning', name: 'Utensils Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'Dishes, pots, pans. Quick and thorough.', img: '/services/utensils-cleaning.jpg', rating: 4.9, reviews: 21800, isNew: false },
  { slug: 'kitchen-prep', name: 'Kitchen Prep', base: 49, original: 125, duration: 45, category: 'kitchen', desc: 'Chopping, sorting, basic prep work.', img: '/services/kitchen-prep.jpg', rating: 4.4, reviews: 10300, isNew: false },
  { slug: 'dusting-wiping', name: 'Dusting & Wiping', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Surfaces, fans, shelves. Dust-free home.', img: '/services/dusting-wiping.jpg', rating: 4.9, reviews: 32000, isNew: false },
  { slug: 'sweeping-mopping', name: 'Sweeping & Mopping', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Full floor clean. Broom and mop included.', img: '/services/sweeping-mopping.jpg', rating: 4.9, reviews: 25100, isNew: false },
  { slug: 'complete-wardrobe', name: 'Complete Wardrobe', base: 497, original: 700, duration: 120, category: 'organization', desc: 'Sort, fold, arrange full wardrobe.', img: '/services/complete-wardrobe.jpg', rating: 4.8, reviews: 7200, isNew: true },
  { slug: 'ironing-folding', name: 'Ironing & Folding', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Iron and fold clothes. Per hour pricing.', img: '/services/ironing-folding.jpg', rating: 4.8, reviews: 9400, isNew: false },
  { slug: 'window-cleaning', name: 'Window Cleaning', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Inside and outside window panes.', img: '/services/window-cleaning.jpg', rating: 4.7, reviews: 5800, isNew: false },
  { slug: 'laundry', name: 'Laundry', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Wash, dry, and fold clothes.', img: '/services/laundry.jpg', rating: 4.8, reviews: 14200, isNew: false },
  { slug: 'kitchen-cleaning', name: 'Kitchen Cleaning', base: 49, original: 150, duration: 60, category: 'kitchen', desc: 'Counter, stove, sink, and appliance wipe.', img: '/services/kitchen-cleaning.jpg', rating: 4.9, reviews: 19300, isNew: false },
  { slug: 'balcony-cleaning', name: 'Balcony Cleaning', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Sweep, mop, and wipe balcony area.', img: '/services/balcony-cleaning.jpg', rating: 4.7, reviews: 6100, isNew: false },
  { slug: 'fan-cleaning', name: 'Fan Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'All ceiling and wall fans cleaned.', img: '/services/fan-cleaning.jpg', rating: 4.6, reviews: 4300, isNew: false },
  { slug: 'kitchen-cabinets', name: 'Kitchen Cabinets', base: 597, original: 800, duration: 90, category: 'kitchen', desc: 'Inside and outside all cabinet cleaning.', img: '/services/kitchen-cabinets.jpg', rating: 4.8, reviews: 3900, isNew: true },
]

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug)
}
