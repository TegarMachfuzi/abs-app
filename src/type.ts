import { SummaryAnalytic } from "@prisma/client";
import { ReactNode } from "react";
import * as z from "zod";

export type Props = { children: ReactNode };

export const analyticFormObj = z.object({
    custId: z.string(),
    name: z.string(),
    items: z.string(),
    date: z.date(),
    netSales: z.number(),
    salesType: z.string(),
});
export type AnalyticForm = z.infer<typeof analyticFormObj>;

export type SummaryAnalyticForm = Pick<
    SummaryAnalytic,
    "customerId" | "customerName" | "frequency" | "monetary" | "recency"
> &
    Partial<
        Pick<
            SummaryAnalytic,
            "monetaryScore" | "frequencyScore" | "recencyScore"
        >
    >;

export const AnalyticsDto = z.object({
    id: z.string(),
    createdDate: z.date(),
    detailAnalytic: z.number(),
    totalCustomer: z.number(),
});
export type AnalyticsDtoType = z.infer<typeof AnalyticsDto>;

export type SummaryAnalyticDto = Omit<
    SummaryAnalytic,
    "rank" | "analyticId"
> & {
    segmentation: string;
};

export interface ChartSegmentationProps {
    name: string;
    Segmentation: number;
}
