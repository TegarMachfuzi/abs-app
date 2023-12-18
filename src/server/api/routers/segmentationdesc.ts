import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SegmentDescription } from "@prisma/client";
import { type } from "os";

const SegmentationDescDto = z.object({
    id: z.string(),
    segment: z.string(),
    activity: z.string(),
    actionableTip: z.string(),
});

export type SegmentationDescType = z.infer<typeof SegmentationDescDto>

export const segmentDescRouter = createTRPCRouter({
    getAll: publicProcedure.query(
        async({ctx}): Promise<SegmentationDescType[]>=> {
            const segmentDesc = await ctx.prisma.segmentDescription.findMany();
            return segmentDesc.map(
                (item) => ({
                    id: item.id,
                    segment: item.segment,
                    activity: item.activity,
                    actionableTip: item.actionableTip,
                }as SegmentationDescType)
            )
        }
    )
})