import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { action, payload, id } = await req.json()

    if (action === 'insert') {
      // Hash password
      const hashedPassword = await bcrypt.hash(payload.password, 10)
      
      const { data, error } = await supabaseAdmin
        .from('admins')
        .insert([{ 
          name: payload.name, 
          username: payload.username, 
          password: hashedPassword 
        }])
        .select()

      if (error) throw error
      return NextResponse.json({ data })

    } else if (action === 'update' && id) {
      const updateData: any = {
        name: payload.name,
        username: payload.username,
      }

      // Hash password if provided
      if (payload.password) {
        updateData.password = await bcrypt.hash(payload.password, 10)
      }

      const { data, error } = await supabaseAdmin
        .from('admins')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error
      return NextResponse.json({ data })

    } else if (action === 'delete' && id) {
      const { error } = await supabaseAdmin
        .from('admins')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('id, name, username, created_at')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
