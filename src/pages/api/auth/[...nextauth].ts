import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { Session, DefaultSession } from "next-auth"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '914628494898-onc9q6mppitoa680q721r42ki64hh556.apps.googleusercontent.com',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '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',
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET || 'hackathon',
  callbacks: {
    session({ session, token }) {
      session.user.sub  = token.sub ;
      return session;
    },
  },
})
