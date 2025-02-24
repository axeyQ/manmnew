// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect();
        
        // Check if user exists
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          // Create new user
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            accounts: []  // Initialize empty accounts array
          });
        }

        // Update or add the account
        const accountExists = dbUser.accounts.some(acc => 
          acc.provider === account.provider && 
          acc.providerAccountId === account.providerAccountId
        );

        if (!accountExists) {
          dbUser.accounts.push({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token,
            expires_at: account.expires_at,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state
          });
        }

        // Update user info
        dbUser.name = user.name;
        dbUser.image = user.image;
        
        await dbUser.save();
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true;  // Still allow sign in even if DB operation fails
      }
    },
    async session({ session, token }) {
      try {
        await dbConnect();
        
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };