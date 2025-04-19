import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!supabaseUrl) {
  console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  console.error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

if (!Boolean(supabaseServiceRoleKey)) {
  console.error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
}

// Create a Supabase client with the anonymous key for client-side operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey
);

// Check if we're on the server side
export const isServer = () => typeof window === "undefined";

// Get the appropriate Supabase client based on the context
export const getSupabase = () => {
  if (isServer()) {
    return supabaseAdmin;
  }
  return supabase;
};
