import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { Session, DefaultSession } from "next-auth"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET || "",
  callbacks: {
    session({ session, token }) {
      session.user.sub  = token.sub ;
      return session;
    },
  },
})
