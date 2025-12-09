
const { createClient } = require('@supabase/supabase-js');

// Config from middleware.ts (visible in previous steps)
const SUPABASE_URL = 'https://dafdejwjgieiuazxmzba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZmRlandqZ2llaXVhenhtemJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDI2NjIsImV4cCI6MjA4MDYxODY2Mn0.S9vZtPjkT4mPqJESsCKUTVZZHay6FpbnB0jIw4pQ6jE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkColumn() {
    // Try to select the 'is_active' column
    const { data, error } = await supabase
        .from('branch_inventory')
        .select('is_active')
        .limit(1);

    if (error) {
        console.log('Error selecting is_active:', error.message);
    } else {
        console.log('Column is_active exists!');
    }
}

checkColumn();
