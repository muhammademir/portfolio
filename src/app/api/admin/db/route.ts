import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Server-side admin client - env var ini TIDAK diexpose ke browser
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { table, action, payload, id } = await req.json()

  const allowedTables = ['experiences', 'projects', 'certificates']
  if (!allowedTables.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const supabaseAdmin = getAdminClient()

  let result
  if (action === 'insert') {
    result = await supabaseAdmin.from(table).insert(payload).select()
  } else if (action === 'update' && id) {
    result = await supabaseAdmin.from(table).update(payload).eq('id', id).select()
  } else if (action === 'delete' && id) {
    result = await supabaseAdmin.from(table).delete().eq('id', id)
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ data: result.data })
}
