import { type GetServerSidePropsContext } from "next";
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { User as UserPrisma } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";
import { z } from "zod";
import { DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: Omit<UserPrisma, "password" | "image">;
    }
    interface User extends Omit<UserPrisma, "password" | "image"> {}

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}
declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user: Omit<UserPrisma, "password" | "image"> & DefaultSession["user"];
    }
    interface User extends Omit<UserPrisma, "password" | "image"> {}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const loginSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(4),
});
export type ILogin = z.infer<typeof loginSchema>;
export const authOptions: NextAuthOptions = {
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.user = user as UserPrisma;
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: env.NEXTAUTH_SECRET || "",
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 30 * 60,
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        Credentials({
            type: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "username",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const creds = await loginSchema.parseAsync(credentials);
                const user = await prisma.user.findFirst({
                    where: {
                        username: creds.username,
                    },
                });
                if (!user || !user.password) {
                    return null;
                }
                const isValidPassword = await verify(
                    user.password,
                    creds?.password
                );

                if (!isValidPassword) {
                    return null;
                }
                const { password, image, ...resp } = user;
                return resp;
            },
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
