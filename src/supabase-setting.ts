import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gjmowzgygkiwxptgvbva.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqbW93emd5Z2tpd3hwdGd2YnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjIyNjgsImV4cCI6MjA2MzIzODI2OH0.-Z6olYkXKCKacfOUOcQFM1C9GMjQlSG6aJY9ZflFedE'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

