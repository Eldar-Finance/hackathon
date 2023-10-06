import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: '914628494898-onc9q6mppitoa680q721r42ki64hh556.apps.googleusercontent.com',
      clientSecret: "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",
    }),
  ],
  secret: 'hackathon',
}

export default NextAuth(authOptions)

