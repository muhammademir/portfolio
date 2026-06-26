import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // Ambil data admin dari Supabase
        const { data: admin } = await supabaseAdmin
          .from('admins')
          .select('*')
          .eq('username', credentials.username)
          .single()

        if (!admin) return null

        // Bandingkan password
        const isValid = await bcrypt.compare(credentials.password, admin.password)

        if (isValid) {
          return { id: admin.id, name: admin.name, email: admin.username }
        }

        return null
      },
    }),
  ],
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
