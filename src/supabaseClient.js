import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iyofwvgztukmlgdrkkyb.supabase.co'
const supabaseAnonKey = 'sb_publishable_31vPI2ACnBQUvtB8Ajhv0A_Ln2_XCiv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
