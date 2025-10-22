import { createClient } from '@supabase/supabase-js';

// Connects your site to your Supabase project using your .env.local values
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);