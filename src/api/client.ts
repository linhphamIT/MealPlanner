import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iairmkhyhcwceyjragoj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaXJta2h5aGN3Y2V5anJhZ29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzUwMDYsImV4cCI6MjA3MzE1MTAwNn0.O-TWKwxTwrm2QhmHP1hANHQtiKP5uL7epNHzH7GHkAM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
