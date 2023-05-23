import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "@utils/database";
import User from "@models/user";
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callback: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      // 현재 로그인한 사용자의 정보를 가져와서
      // 해당 사용자의 id를 세션 객체에 추가하는 역할을 함

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // check if a user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });
        //if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
