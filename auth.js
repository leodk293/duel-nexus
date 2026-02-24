import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "./lib/connectDB";
import User from "./lib/models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              avatarUrl: user.image || "",
            });
            console.log("New user created:", user.email);
          } else {
            console.log("User already exists:", user.email);
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     await connectMongoDB();
    //     const dbUser = await User.findOne({ email: user.email });
    //     if (dbUser) {
    //       token.id = dbUser._id.toString();
    //       token.name = dbUser.name;
    //       token.email = dbUser.email;
    //       token.avatarUrl = dbUser.avatarUrl;
    //     }
    //   }
    //   return token;
    // },

    async jwt({ token, user }) {
      if (user?.email) {
        await connectMongoDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.avatarUrl = dbUser.avatarUrl;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.avatarUrl;
      }
      return session;
    },
  },
});
