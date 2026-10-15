import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./supabaseConfig";
export { supabaseConfigured } from "./supabaseConfig";

export const supabase = createClient(
  supabaseUrl || "https://invalid.supabase.co",
  supabaseKey || "missing-key",
);
