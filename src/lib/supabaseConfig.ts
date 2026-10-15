export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as
  | string
  | undefined;
export const supabaseKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
