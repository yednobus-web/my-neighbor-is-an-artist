// Re-exports — keeps existing import paths working. Server-only symbols
// live in supabase-server.ts; browser-safe ones in supabase-browser.ts.
// Do NOT import this file from client components — import supabase-browser directly.
export * from "./supabase-server";
export { createSupabaseBrowser } from "./supabase-browser";
