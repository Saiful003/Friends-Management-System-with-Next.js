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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // callbacks to more control
  callbacks: {
    async signIn({ user, account }) {
      // console.log({ user });
      if (account.type === "oauth") {
        // workflow
        //==> Check our database via our email that user exist or not
        //==> If exist means this user is our registered user. So return true;
        //===> If user not exist, means we need first signup/register this user into our database and than return true
        try {
          await dbConnect();
          const { email } = user;
          const isExistUser = await User.findOne({ email });
          if (isExistUser) return true;

          if (!isExistUser) {
            // save user
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              isVerifiedUser: true,
            });
            await newUser.save();
            return true;
          }
        } catch (err) {
          return false;
        }

        return true; // means you are welcome to signin/login
      }

      return true; // means you are welcome to signin/login
    },
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
