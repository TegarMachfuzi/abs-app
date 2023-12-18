import { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode } from "react";

export type NextPageWithContextProvider<P = unknown> = NextPage<P> & {
    getContext?: (_page: ReactElement) => ReactNode;
    context?: ComponentType;
};
