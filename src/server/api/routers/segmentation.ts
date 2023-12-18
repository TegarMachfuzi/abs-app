import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SegmentationConfig } from "@prisma/client";

const SegmentationDto = z.object({
    id: z.string(),
    labelName: z.string(),
    description: z.string(),
    minRecency: z.number(),
    minFrequency: z.number(),
    minMonetary: z.number(),
});

export type SegmentationType = z.infer<typeof SegmentationDto>;

export const segmentRouter = createTRPCRouter({
    getAll: publicProcedure.query(
        async ({ ctx }): Promise<SegmentationType[]> => {
            const segment = await ctx.prisma.segmentationConfig.findMany();
            return segment.map(
                (item) =>
                    ({
                        id: item.id,
                        labelName: item.labelName,
                        description: item.description,
                        minRecency: item.minRecency,
                        minFrequency: item.minFrequency,
                        minMonetary: item.minMonetary,
                    } as SegmentationType)
            );
        }
    ),
    findById: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const segment = await ctx.prisma.segmentationConfig.findUnique({
                where: {
                    id: input,
                },
            });
            if (!segment) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "SegmentID Not Found",
                });
            }
            return {
                labelName: segment.labelName,
                description: segment.description,
                minRecency: segment.minRecency,
                minFrequency: segment.minFrequency,
                minMonetary: segment.minMonetary,
                id: segment.id,
            };
        }),
    create: publicProcedure
        .input(
            z.object({
                labelName: z.string(),
                description: z.string(),
                minRecency: z.number(),
                minFrequency: z.number(),
                minMonetary: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // const existSegment = await ctx.prisma.segmentationConfig.findFirst({
            //     where: {
            //         labelName: input.labelName,
            //     },
            // });
            // if (existSegment) {
            //     throw new TRPCError({
            //         code: "BAD_REQUEST",
            //         message: "Label Name has Registered",
            //     });
            // }
            const segment = await ctx.prisma.segmentationConfig.create({
                data: {
                    labelName: input.labelName,
                    description: input.description,
                    minRecency: input.minRecency,
                    minFrequency: input.minFrequency,
                    minMonetary: input.minMonetary,
                },
            });
            return segment;
        }),
    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                labelName: z.string(),
                description: z.string(),
                minRecency: z.number(),
                minFrequency: z.number(),
                minMonetary: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            let segment: SegmentationConfig | null;
            if (input.id) {
                segment = await ctx.prisma.segmentationConfig.findUnique({
                    where: {
                        id: input.id,
                    },
                });
                if (segment) {
                    segment = await ctx.prisma.segmentationConfig.update({
                        data: {
                            labelName: input.labelName,
                            minRecency: input.minRecency,
                            minFrequency: input.minFrequency,
                            minMonetary: input.minMonetary,
                            description: input.description,
                        },
                        where: {
                            id: segment.id,
                        },
                    });
                }
            }
        }),
    deleteSegment: publicProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const segment = await ctx.prisma.segmentationConfig.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!segment) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "segment not found",
                });
            }
            return await ctx.prisma.segmentationConfig.delete({
                where: {
                    id: input.id,
                },
            });
        }),
});
