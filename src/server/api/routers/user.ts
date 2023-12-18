import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { Role } from "@prisma/client";
import { generateAvatar } from "~/lib/utils";

const DEFAULT_PASSWORD = "123456789";

const UserDto = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    address: z.string(),
    company: z.string(),
    role: z.string(),
});
export type UserType = z.infer<typeof UserDto>;
// publicProcedure.query untuk API yang GET
// publicProcedure.mutate untuk API yang POST
export const userRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }): Promise<UserType[]> => {
        const users = await ctx.prisma.user.findMany();
        return users.map(
            (item) =>
                ({
                    id: item.id,
                    name: item.name,
                    address: item.address,
                    company: item.company,
                    username: item.username,
                    role: item.role,
                } as UserType)
        );
    }),
    findById: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: input,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            }
            return {
                name: user.name,
                username: user.username,
                address: user.address,
                company: user.company,
                image: user.image,
                id: user.id,
                role: user.role,
            };
        }),
    create: publicProcedure
        .input(
            z.object({
                company: z.string(),
                name: z.string(),
                username: z.string(),
                password: z.string(),
                address: z.string(),
                role: z.enum([Role.ADMIN, Role.COMPANY]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const existUser = await ctx.prisma.user.findFirst({
                where: {
                    username: input.username,
                },
            });
            if (existUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Username has registered",
                });
            }
            const hashPass = await hash(input.password);
            const { password, ...user } = await ctx.prisma.user.create({
                data: {
                    name: input.name,
                    role: input.role,
                    username: input.username,
                    company: input.company,
                    address: input.address,
                    password: hashPass,
                    image: generateAvatar(),
                },
            });
            return user;
        }),
    update: publicProcedure
        .input(
            z.object({
                company: z.string(),
                name: z.string(),
                address: z.string(),
                username: z.string(),
                role: z.enum([Role.ADMIN, Role.COMPANY]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    username: input.username,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found ",
                });
            }
            const { password, ...updatedUser } = await ctx.prisma.user.update({
                data: {
                    ...user,
                    name: input.name,
                    role: input.role,
                    company: input.company,
                    address: input.address,
                },
                where: {
                    username: input.username,
                },
            });
            return updatedUser;
        }),
    resetPassword: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    username: input.username,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found ",
                });
            }
            const hashPass = await hash(DEFAULT_PASSWORD);
            await ctx.prisma.user.update({
                data: {
                    password: hashPass,
                },
                where: {
                    username: input.username,
                },
            });
            return;
        }),
    updatePassword: publicProcedure
        .input(
            z.object({
                username: z.string(),
                newPassword: z.string(),
                oldPassword: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    username: input.username,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found ",
                });
            }
            const isValidPass = await verify(user.password, input.oldPassword);
            if (!isValidPass) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Wrong Password or Email, Please Try Again",
                });
            }
            const hashPass = await hash(input.newPassword);
            await ctx.prisma.user.update({
                data: {
                    password: hashPass,
                },
                where: {
                    username: input.username,
                },
            });
            return;
        }),
    delete: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!user) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found",
                });
            }
            return await ctx.prisma.user.delete({
                where: {
                    id: input.id,
                },
            });
        }),
});
