import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(nuxtApp => {
  const supabaseUrl = nuxtApp.$config.supabaseURL;
  const supabaseKey = nuxtApp.$config.supabaseKey;
  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    provide: {
      injected: supabase
    }
  }
})