import Head from "next/head";
import * as React from "react";
import { cn } from "~/lib/utils";
import SideNav from "./SideNav";

const LayoutMobile = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0"
                />
                <link rel="icon" href="/coffee1.png" sizes="any" />
            </Head>
            <div className="flex w-full justify-center">
                <div
                    ref={ref}
                    className={cn(
                        "h-[100dvh] w-full max-w-md overflow-y-hidden border-x-inherit bg-gray-100",
                        className
                    )}
                    {...props}
                />
            </div>
        </>
    );
});
LayoutMobile.displayName = "LayoutMobile";

const LayoutDashboard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <>
        <div
            className={cn("min-h-screen flex-grow p-5 ", className)}
            ref={ref}
            {...props}
        />
    </>
));
LayoutDashboard.displayName = "LayoutDashboard";

const Layout = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <>
        <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=0"
            />
            <link rel="icon" href="/coffee1.png" sizes="any" />
        </Head>
        <div
            ref={ref}
            className={cn(
                "flex h-screen w-full overflow-y-auto dark:bg-black "
            )}
            {...props}
        >
            <SideNav />
            <LayoutDashboard>
                <div className={cn("p-4 pb-32", className)}>{children}</div>
            </LayoutDashboard>
        </div>
    </>
));
Layout.displayName = "Layout";

interface LayoutMasterProps extends React.HTMLAttributes<HTMLDivElement> {
    headerComponent?: React.ReactNode;
}

const LayoutMaster = React.forwardRef<HTMLDivElement, LayoutMasterProps>(
    ({ className, headerComponent, children, title, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("flex w-full flex-col gap-6", className)}
            {...props}
        >
            <div className="flex w-full items-start justify-between">
                <p className="text-2xl font-bold">{title}</p>
                {headerComponent || <></>}
            </div>
            {children}
        </div>
    )
);
LayoutMaster.displayName = "LayoutMaster";

export { LayoutMobile, LayoutDashboard, Layout, LayoutMaster };
