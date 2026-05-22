import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const missingEnvMessage = 'Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(missingEnvMessage)
  }

  client ??= createClient(supabaseUrl, supabaseAnonKey)
  return client
}
