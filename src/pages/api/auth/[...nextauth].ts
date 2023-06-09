import { compare, genSalt, hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { addUserUC } from "@/server/Features/user/AddUser";
import { getUserByUsername } from "@/server/Features/user/GetUserByUsername";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const foundUser = await getUserByUsername({
          username: credentials?.username ?? "",
        });

        if (!foundUser.data) {
          return null;
        }

        const checkPassword = await compare(
          credentials?.password ?? "",
          foundUser.data.password
        );

        if (!checkPassword) return null;
        // If no error and we have user data, return it
        return { id: foundUser.data.userId, username: foundUser.data.username };
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    session({ session, token }) {
      // I skipped the line below coz it gave me a TypeError
      // session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const user = z.object({
  username: z.string().min(4).max(25),
  password: z.string().min(8).max(25),
});

async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  const result = user.safeParse({ username, password });

  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  const hashPassword = await hash(password, await genSalt());
  const createdUser = await addUserUC({
    username,
    password: hashPassword,
    status: "online",
    userId: uuidv4(),
  });

  // res.redirect("/api/auth/signin");
  if (createdUser.success && createdUser.data) {
    res.status(200).json({ completedRegistration: true });
    return;
  }
  res.status(400).json({ error: createdUser.error });
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { nextauth } = req.query;

  if (nextauth?.includes("signup") && req.method === "POST") {
    registerUser(req, res);
  } else {
    NextAuth(req, res, authOptions);
  }
};
