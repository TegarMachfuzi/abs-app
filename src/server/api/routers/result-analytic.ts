import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { SummaryAnalytic } from "@prisma/client";
import _ from "underscore";

type SummaryMerged = {
    segmentationId: string;
    label: string;
} & SummaryAnalytic;
export const ResultAnalytic = createTRPCRouter({
    getSummary: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input: analyticId }) => {
            const summary = await ctx.prisma.summaryAnalytic.findMany({
                where: {
                    analyticId: analyticId,
                },
            });
            const segmentationConfig =
                await ctx.prisma.segmentationConfig.findMany();
            const merged: SummaryMerged[] = summary.map((item) => {
                const segmentation = segmentationConfig.find((seg) => {
                    return (
                        seg.minFrequency === item.frequencyScore &&
                        seg.minRecency === item.recencyScore &&
                        seg.minMonetary === item.monetaryScore
                    );
                });
                return {
                    label: segmentation?.labelName ?? "Uncategorized",
                    segmentationId: segmentation?.id ?? "0",
                    ...item,
                };
            });
            const grouped = _.groupBy(merged, (item) => item.label);
            return {
                segmentation: grouped,
                summary: merged,
            };
        }),
});
