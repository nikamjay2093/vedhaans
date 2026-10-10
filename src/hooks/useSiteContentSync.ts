import { useEffect } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { fetchSiteContentRaw } from '../services/siteContentCloud'
import { mergeSiteFromCloud } from '../context/siteDataHelpers'
import type { CategoryMeta, Product, SiteBranding } from '../types'

export function useSiteContentRealtime(
  enabled: boolean,
  onRemoteUpdate: (data: {
    products: Product[]
    categories: CategoryMeta[]
    branding: SiteBranding
  }) => void,
) {
  useEffect(() => {
    if (!enabled) return
    const supabase = getSupabase()
    if (!supabase) return

    const reload = async () => {
      try {
        const row = await fetchSiteContentRaw()
        onRemoteUpdate(mergeSiteFromCloud(row))
      } catch {
        /* ignore */
      }
    }

    const channel = supabase
      .channel('vedhaans-site-content')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'site_content' },
        () => {
          void reload()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [enabled, onRemoteUpdate])
}

export async function loadSiteFromCloud() {
  if (!isSupabaseConfigured()) return null
  const row = await fetchSiteContentRaw()
  return mergeSiteFromCloud(row)
}
