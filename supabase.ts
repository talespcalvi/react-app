import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = 'https://skfpawgbssvyxgkyqiat.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZnBhd2dic3N2eXhna3lxaWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMzE3MzAsImV4cCI6MjA0NjkwNzczMH0.vyE1zE-e-H8QaESjBuPXg0AFK4ukyYtjDDQkBtn2ffA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
