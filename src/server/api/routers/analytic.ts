import _ from "underscore";
import { z } from "zod";
import { calculateRFM } from "~/server/services/analytic-service";
import { AnalyticsDtoType, analyticFormObj } from "~/type";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analyticRouter = createTRPCRouter({
    getAnalytic: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input: id }) => {
            const analytic = await ctx.prisma.analytics.findUnique({
                where: {
                    id,
                },
            });
            return { id: analytic?.id, createdDate: analytic?.createdDate };
        }),
    getHistory: protectedProcedure.query(
        async ({ ctx }): Promise<AnalyticsDtoType[]> => {
            const histories = await ctx.prisma.analytics.findMany({
                where: {
                    userId: ctx.session.user.id,
                },
                orderBy: {
                    createdDate: "desc",
                },
                include: {
                    _count: {
                        select: {
                            DetailAnalytic: true,
                            SummaryAnalytic: true,
                        },
                    },
                },
            });
            return histories.map((item) => ({
                id: item.id,
                createdDate: item.createdDate,
                detailAnalytic: item._count.DetailAnalytic,
                totalCustomer: item._count.SummaryAnalytic,
            }));
        }
    ),
    initAnalytic: protectedProcedure.mutation(async ({ ctx }) => {
        const { user } = ctx.session;
        const analytic = await ctx.prisma.analytics.create({
            data: {
                userId: user.id,
            },
        });
        return analytic.id;
    }),
    importAnalytic: protectedProcedure
        .input(
            z.object({
                analyticId: z.string(),
                data: z.array(analyticFormObj),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data, analyticId } = input;
            await ctx.prisma.detailAnalytic.createMany({
                data: data.map((item) => ({
                    analyticId: analyticId,
                    customerId: item.custId,
                    items: item.items,
                    purchaseDate: item.date,
                    salesType: item.salesType,
                    totalPurchase: item.netSales,
                    createdDate: new Date(),
                    customerName: item.name,
                })),
            });
        }),
    summaryAnalytic: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: analyticId }) => {
            const data = await ctx.prisma.detailAnalytic.findMany({
                where: {
                    analyticId,
                },
            });
            const grouped = _.groupBy(data, (item) => item.customerId);
            const rfm = calculateRFM(grouped);
            await ctx.prisma.summaryAnalytic.createMany({
                data: rfm.map((item, idx) => ({
                    analyticId,
                    rank: idx + 1,
                    recencyScore: item.recencyScore ?? 0,
                    frequencyScore: item.frequencyScore ?? 0,
                    monetaryScore: item.monetaryScore ?? 0,
                    ...item,
                })),
            });
            return analyticId;
        }),
});
