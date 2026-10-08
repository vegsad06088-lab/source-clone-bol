import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pbrnbsvkrxdxmrdmiybw.supabase.co';
const supabaseAnonKey = 'sb_publishable_coV3UN9iSbxnpKeaFywceQ_4MwKETKV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
