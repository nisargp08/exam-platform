import { createClient } from "@supabase/supabase-js"

// Singleton pattern for browser client
let browserClient: ReturnType<typeof createClient> | null = null

// Create a single supabase client for the browser
export const createBrowserClient = () => {
  if (browserClient) return browserClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
    })
    throw new Error("Missing required environment variables for Supabase")
  }

  console.log("Creating browser Supabase client")
  browserClient = createClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}

// Singleton pattern for server client
let serverClient: ReturnType<typeof createClient> | null = null

// Create a single supabase client for server components
export const createServerClient = () => {
  if (serverClient) return serverClient

  // Log all available environment variables (without values for security)
  const envVars = Object.keys(process.env).filter((key) => key.includes("SUPABASE") || key.includes("POSTGRES"))
  console.log("Available environment variables:", envVars)

  // Try different environment variable combinations
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("Missing Supabase URL")
    throw new Error("Missing Supabase URL")
  }

  if (!supabaseServiceKey) {
    console.error("Missing Supabase service key")
    throw new Error("Missing Supabase service key")
  }

  console.log("Creating server Supabase client")

  try {
    serverClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // Test the connection
    console.log("Testing Supabase connection...")

    return serverClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}
