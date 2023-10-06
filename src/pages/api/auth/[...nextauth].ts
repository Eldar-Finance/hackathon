import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
}

export default NextAuth(authOptions)

