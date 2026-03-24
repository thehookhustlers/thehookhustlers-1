// Supabase Configuration
const SUPABASE_URL = 'https://gnybxtlstxvzpijolsaz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueWJ4dGxzdHh2enBpam9sc2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjEwODUsImV4cCI6MjA4OTkzNzA4NX0._a6mEmM-fqJbe7Xapq81N244YExar3rffy5GxUkJjN4';

// Initialize the Supabase Client
// We attach it to the window object so it can be accessed globally by any page
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase Client Successfully Initialized');
