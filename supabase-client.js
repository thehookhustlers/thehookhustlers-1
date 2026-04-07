// Supabase Configuration
// Using window wrapper to prevent crashes if this file is imported twice
if (!window.SUPABASE_ANON_KEY) {
    window.SUPABASE_URL = 'https://gnybxtlstxvzpijolsaz.supabase.co';
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueWJ4dGxzdHh2enBpam9sc2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjEwODUsImV4cCI6MjA4OTkzNzA4NX0._a6mEmM-fqJbe7Xapq81N244YExar3rffy5GxUkJjN4';

    // Initialize the Supabase Client
    // We attach it to the window object so it can be accessed globally by any page
    window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

// This uses the 'contacts' table as a lightweight activity log for now
// to avoid schema migration overhead for the user.
window.trackInteraction = async (targetId, type) => {
    try {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (!user) return;

        // Log to 'contacts' table which we use for messaging/interests
        await window.supabaseClient
            .from('contacts')
            .insert([{
                user_id: user.id,
                target_id: targetId,
                type: type, // 'view' or 'interest'
                created_at: new Date()
            }]);
            
        console.log(`📊 Interaction Tracked: ${type} -> ${targetId}`);
        
        // If type is 'interest', we also set a local flag to prevent double-click
        if (type === 'interest') {
            localStorage.setItem(`hh_interest_${targetId}`, 'true');
        }
    } catch (err) {
        console.error('Failed to track interaction:', err);
    }
};

console.log('✅ Supabase Client Successfully Initialized');
}

