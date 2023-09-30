import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../Model/userModel";
import bcrypt from "bcrypt";
import dbConnect from "../../../lib/dbConnect";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        const { email, password } = credentials;

        // connect to database
        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Did not found any user");
        }
        if (user && !user.isVerifiedUser) {
          throw new Error("Unverified User");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Authentication failed");
        }

        // If no error and we have user data, return it
        if (user && isValidPassword) {
          return user;
        }
      },
    }),
    // GoogleProvider({

    // })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.name = token.username;
      session.user.user_id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
