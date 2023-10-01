import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../Model/userModel";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/dbConnect";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          await dbConnect();
          const user = await User.findOne({ email });
          if (!user) return null;
          if (user && !user.isVerifiedUser) return null;
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) return null;
          // If no error and we have user data, return it
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } catch (err) {
          return null;
        }
      },
    }),

    // GoogleProvider({

    // })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // we can store any kind of information inside this token
      // This callback called when
      // signIn invoked
      if (user) {
        token.userId = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
