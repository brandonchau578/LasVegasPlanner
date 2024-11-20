import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fvkpqzhahsqswhchkvkn.supabase.co'; // Replace with your API URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2a3BxemhhaHNxc3doY2hrdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjM2MjMsImV4cCI6MjA0NjQ5OTYyM30.aMD0UNoYotblb1pqeNofojfNN3acuW6zehmZV892EXA'; // Replace with your Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);