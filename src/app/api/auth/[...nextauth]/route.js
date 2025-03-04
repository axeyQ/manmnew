import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session for easier access
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect back to homepage after authentication
      return baseUrl;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in regardless of whether the account is linked or not
      return true;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  // Allow account linking
  allowDangerousEmailAccountLinking: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };