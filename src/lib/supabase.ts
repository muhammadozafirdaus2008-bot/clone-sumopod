import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qgpnibayvmcvpquhvjpt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncG5pYmF5dm1jdnBxdWh2anB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTQ4MTQsImV4cCI6MjA5MTI5MDgxNH0.ii4c5O0t9bHJpMOQgfTl7yOxwi44JYFqZ8YDtg-G8Ds";

export const supabase = createClient(supabaseUrl, supabaseKey);