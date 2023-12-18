import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { analyticRouter } from "./routers/analytic";
import { segmentRouter } from "./routers/segmentation";
import { segmentDescRouter } from "./routers/segmentationdesc";
import { ResultAnalytic } from "./routers/result-analytic";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    segmentation: segmentRouter,
    analytic: analyticRouter,
    resultAnalytic: ResultAnalytic,
    segmentationDesc: segmentDescRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
