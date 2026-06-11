import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Indica se as chaves do Supabase foram configuradas (.env / Vercel). */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Cliente Supabase. É null se as variáveis de ambiente não estiverem definidas,
 * para que a tela de login possa avisar de forma amigável em vez de quebrar.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
