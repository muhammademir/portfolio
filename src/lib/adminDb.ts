/**
 * Helper untuk memanggil admin API route dari client components
 * Ini aman karena service_role key ada di server, bukan browser
 */
export async function adminDb(
  table: string,
  action: 'insert' | 'update' | 'delete',
  payload?: Record<string, unknown>,
  id?: string
) {
  const res = await fetch('/api/admin/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, action, payload, id }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Gagal operasi database')
  }

  return res.json()
}
