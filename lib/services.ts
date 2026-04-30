export const SERVICES = [
  { slug: 'bathroom-cleaning', name: 'Bathroom Cleaning', base: 49, original: 125, duration: 40, category: 'cleaning', desc: 'Deep clean of bathroom. Tiles, toilet, sink, mirror.' },
  { slug: 'fridge-cleaning', name: 'Fridge Cleaning', base: 149, original: 250, duration: 60, category: 'cleaning', desc: 'Inside and outside. Shelves, drawers, seals.' },
  { slug: 'packing-unpacking', name: 'Packing / Unpacking', base: 49, original: 125, duration: 90, category: 'moving', desc: 'Careful packing and unpacking of household items.' },
  { slug: 'utensils-cleaning', name: 'Utensils Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'Dishes, pots, pans. Quick and thorough.' },
  { slug: 'kitchen-prep', name: 'Kitchen Prep', base: 49, original: 125, duration: 45, category: 'kitchen', desc: 'Chopping, sorting, basic prep work.' },
  { slug: 'dusting-wiping', name: 'Dusting and Wiping', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Surfaces, fans, shelves. Dust-free home.' },
  { slug: 'sweeping-mopping', name: 'Sweeping and Mopping', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Full floor clean. Broom and mop included.' },
  { slug: 'complete-wardrobe', name: 'Complete Wardrobe', base: 497, original: 700, duration: 120, category: 'organization', desc: 'Sort, fold, arrange full wardrobe.' },
  { slug: 'ironing-folding', name: 'Ironing and Folding', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Iron and fold clothes. Per hour pricing.' },
  { slug: 'window-cleaning', name: 'Window Cleaning', base: 49, original: 125, duration: 45, category: 'cleaning', desc: 'Inside and outside window panes.' },
  { slug: 'laundry', name: 'Laundry', base: 49, original: 125, duration: 60, category: 'laundry', desc: 'Wash, dry, and fold clothes.' },
  { slug: 'kitchen-cleaning', name: 'Kitchen Cleaning', base: 49, original: 150, duration: 60, category: 'kitchen', desc: 'Counter, stove, sink, and appliance wipe.' },
  { slug: 'balcony-cleaning', name: 'Balcony Cleaning', base: 49, original: 125, duration: 30, category: 'cleaning', desc: 'Sweep, mop, and wipe balcony area.' },
  { slug: 'fan-cleaning', name: 'Fan Cleaning', base: 49, original: 125, duration: 20, category: 'cleaning', desc: 'All ceiling and wall fans cleaned.' },
  { slug: 'kitchen-cabinets', name: 'Kitchen Cabinets', base: 597, original: 800, duration: 90, category: 'kitchen', desc: 'Inside and outside all cabinet cleaning.' },
]

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug)
}
