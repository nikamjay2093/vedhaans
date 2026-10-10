import { useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { fetchCloudEnquiries } from '../services/enquiryCloud'
import type { Enquiry } from '../types'

export function useCloudEnquiries(enabled: boolean) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setEnquiries([])
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        const list = await fetchCloudEnquiries()
        if (!cancelled) {
          setEnquiries(list)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Could not load enquiries.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    const channel = supabase
      .channel('vedhaans-enquiries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        () => {
          void load()
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      void supabase.removeChannel(channel)
    }
  }, [enabled])

  return { enquiries, loading, error }
}
