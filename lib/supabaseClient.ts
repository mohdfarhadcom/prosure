import { createClient } from '@supabase/supabase-js'

// Use empty-string placeholders so module load never throws when env vars are
// missing (e.g. during Vercel preview builds with no env set). At runtime in
// the browser the inlined NEXT_PUBLIC_* values are present, so calls work.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(url || 'https://placeholder.supabase.co', anon || 'placeholder')
