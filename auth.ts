import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: 'jwt' as const,
  },

  // Configure one or more authentication providers
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,

    }),
    Resend({
      from: 'auth@mail.starko.one',
      apiKey: process.env.RESEND_API_KEY!,

    })
  ],

  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    jwt({ token, user }) {
      

      token.id = token.sub


      return token
    },
    async session({ session, token }) {

      const serverResponse = await fetch(process.env.ENVIRONMENT === 'local' ? 'http://localhost:3000/api/user' : 'https://healthcare.starko.one/api/user', {
        'method': 'GET',
        'credentials': 'include',
        'headers': {
          'Authorization': `Bearer ${token.id}`
        }
      })
      const data = await serverResponse.json()

      return { ...session, user: { ...session.user, ...token, ...data.response } }
    },
  },


  pages: {
    signIn: '/',

  },



})