import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '914628494898-onc9q6mppitoa680q721r42ki64hh556.apps.googleusercontent.com',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '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',
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET || 'hackathon',
  callbacks: {
    session: async ({ session, token }: { session: any, token: any }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }: { user: any, token: any }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
