import { getSupabase } from '../lib/supabase'
import type { Enquiry } from '../types'

type EnquiryRow = {
  id: string
  product_id: string
  product_name: string
  name: string
  email: string
  phone: string
  company: string | null
  quantity: string | null
  message: string | null
  created_at: string
}

function rowToEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company ?? undefined,
    quantity: row.quantity ?? '',
    message: row.message ?? '',
    createdAt: row.created_at,
  }
}

export async function insertCloudEnquiry(
  data: Omit<Enquiry, 'id' | 'createdAt'>,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Cloud enquiries are not configured.')

  const { error } = await supabase.from('enquiries').insert({
    product_id: data.productId,
    product_name: data.productName,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company ?? '',
    quantity: data.quantity ?? '',
    message: data.message ?? '',
  })

  if (error) throw error
}

export async function fetchCloudEnquiries(): Promise<Enquiry[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as EnquiryRow[]).map(rowToEnquiry)
}
