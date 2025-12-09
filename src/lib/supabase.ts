
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://dafdejwjgieiuazxmzba.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZmRlandqZ2llaXVhenhtemJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDI2NjIsImV4cCI6MjA4MDYxODY2Mn0.S9vZtPjkT4mPqJESsCKUTVZZHay6FpbnB0jIw4pQ6jE'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
