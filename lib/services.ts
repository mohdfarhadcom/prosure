export const SERVICES = [
  { slug: 'bathroom-cleaning', name: 'Bathroom Cleaning', base: 49, original: 125, duration: 40, category: 'cleaning', desc: 'Deep clean of bathroom. Tiles, toilet, sink, mirror.', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&auto=format&q=80' },
  { slug: 'fridge-cleaning', name: 'Fridge Cleaning', base: 149, original: 250, duration: 60, category: 'cleaning', desc: 'Inside and outside. Shelves, drawers, seals.', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&auto=format&q=80' },
  { slug: 'packing-unpacking', name: 'Packing / Unpacking', base: 49, original: 125, duration: 90, category: 'moving', desc: 'Careful packing and unpacking of household items.', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&auto=format&q=80' },
  { slug: 'utensils-cleaning', name: 'Utensils Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'Dishes, pots, pans. Quick and thorough.', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&auto=format&q=80' },
  { slug: 'kitchen-prep', name: 'Kitchen Prep', base: 49, original: 125, duration: 45, category: 'kitchen', desc: 'Chopping, sorting, basic prep work.', img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&auto=format&q=80' },
  { slug: 'dusting-wiping', name: 'Dusting and Wiping', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Surfaces, fans, shelves. Dust-free home.', img: 'https://images.unsplash.com/photo-1527515637-0ec73f94e1e5?w=400&auto=format&q=80' },
  { slug: 'sweeping-mopping', name: 'Sweeping and Mopping', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Full floor clean. Broom and mop included.', img: 'https://images.unsplash.com/photo-1563453392-9b81c098a2a5?w=400&auto=format&q=80' },
  { slug: 'complete-wardrobe', name: 'Complete Wardrobe', base: 497, original: 700, duration: 120, category: 'organization', desc: 'Sort, fold, arrange full wardrobe.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&q=80' },
  { slug: 'ironing-folding', name: 'Ironing and Folding', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Iron and fold clothes. Per hour pricing.', img: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&auto=format&q=80' },
  { slug: 'window-cleaning', name: 'Window Cleaning', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Inside and outside window panes.', img: 'https://images.unsplash.com/photo-1600585154-370d1cc65eba?w=400&auto=format&q=80' },
  { slug: 'laundry', name: 'Laundry', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Wash, dry, and fold clothes.', img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&auto=format&q=80' },
  { slug: 'kitchen-cleaning', name: 'Kitchen Cleaning', base: 49, original: 150, duration: 60, category: 'kitchen', desc: 'Counter, stove, sink, and appliance wipe.', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&q=80' },
  { slug: 'balcony-cleaning', name: 'Balcony Cleaning', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Sweep, mop, and wipe balcony area.', img: 'https://images.unsplash.com/photo-1499916078-2fca5a3f4985?w=400&auto=format&q=80' },
  { slug: 'fan-cleaning', name: 'Fan Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'All ceiling and wall fans cleaned.', img: 'https://images.unsplash.com/photo-1513694203-0c09c2a7bb76?w=400&auto=format&q=80' },
  { slug: 'kitchen-cabinets', name: 'Kitchen Cabinets', base: 597, original: 800, duration: 90, category: 'kitchen', desc: 'Inside and outside all cabinet cleaning.', img: 'https://images.unsplash.com/photo-1556909072-0f2a5c67a5bc?w=400&auto=format&q=80' },
]

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug)
}
