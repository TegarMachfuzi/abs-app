import { NextPage } from "next";
import SideNav from "~/components/ui/SideNav";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { LayoutDashboard } from "~/components/ui/layout";

import { Metadata } from "next";
import Image from "next/image";
import { Activity, DollarSign, Users } from "lucide-react";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { Overview } from "~/components/ui/overview";
import { Transaction } from "@prisma/client";
import { api } from "~/utils/api";
import { useState } from "react";
import MoneyFormatter from "~/components/money-formatter";
import { useRouter } from "next/router";

export const metadata: Metadata = {
    title: "Foodie",
    description: "Best place to heal your mental healthy.",
};

const Dashboard: NextPage = () => {
    const [transactionMonth, setTransactionMonth] = useState<Transaction[]>([]);
    const [transactionOngoing, setTransactionOngoing] = useState<Transaction[]>(
        []
    );
    const monthDate = new Date();
    const router = useRouter();
    const current = new Date(monthDate.getFullYear(), monthDate.getMonth());
    api.transaction.getAllDone.useQuery(undefined, {
        onSuccess: (data) => {
            setTransactionMonth(
                data.map(
                    (item) =>
                        ({
                            id: item.id,
                            total: item.total,
                            tax: item.tax,
                            createdDate: item.createdDate,
                        } as Transaction)
                )
            );
        },
    });

    api.transaction.getAllTransaction.useQuery(undefined, {
        onSuccess: (data) => {
            setTransactionOngoing(
                data.map(
                    (item) =>
                        ({
                            id: item.id,
                            customerName: item.customerName,
                            customerPhone: item.customerPhone,
                            total: item.total,
                            tax: item.tax,
                        } as Transaction)
                )
            );
        },
    });

    const result = transactionMonth.filter((currentDate) => {
        return (
            currentDate.createdDate >= current &&
            currentDate.createdDate < monthDate
        );
    });

    const revenue =
        result.reduce((a, b) => a + b.total, 0) +
        result.reduce((a, b) => a + b.tax, 0);

    return (
        <div className="flex w-full items-start bg-zinc-100">
            <SideNav />
            <LayoutDashboard>
                <div className="md:hidden">
                    <Image
                        src="/examples/dashboard-light.png"
                        width={1280}
                        height={866}
                        alt="Dashboard"
                        className="block dark:hidden"
                    />
                    <Image
                        src="/examples/dashboard-dark.png"
                        width={1280}
                        height={866}
                        alt="Dashboard"
                        className="hidden dark:block"
                    />
                </div>
                <div className="hidden flex-col md:flex">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            Dashboard
                        </div>
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card
                                        onClick={() =>
                                            router.push("/dashboard/history")
                                        }
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Revenue
                                            </CardTitle>
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                <MoneyFormatter
                                                    value={revenue}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                this month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card
                                        onClick={() =>
                                            router.push("/dashboard/history")
                                        }
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Order
                                            </CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {result.length}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                this month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card
                                        onClick={() =>
                                            router.push(
                                                "/dashboard/transaction"
                                            )
                                        }
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Active Now
                                            </CardTitle>
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {transactionOngoing.length}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                need to process
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Card className="col-span-4">
                                        <CardHeader>
                                            <CardTitle>Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pl-2">
                                            <Overview />
                                        </CardContent>
                                    </Card>
                                    <Card className="col-span-3">
                                        <CardHeader>
                                            <CardTitle>Recent Sales</CardTitle>
                                            <CardDescription>
                                                You made{" "}
                                                {transactionOngoing.length}{" "}
                                                sales.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-8">
                                                {transactionOngoing.map(
                                                    (item) => (
                                                        <div
                                                            className="flex items-center"
                                                            key={item.id}
                                                        >
                                                            <div className="ml-4 space-y-1">
                                                                <p className="text-sm font-medium leading-none">
                                                                    {
                                                                        item.customerName
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Phone:{" "}
                                                                    {
                                                                        item.customerPhone
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="ml-auto font-medium">
                                                                <MoneyFormatter
                                                                    value={
                                                                        item.total +
                                                                        item.tax
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </LayoutDashboard>
        </div>
    );
};
export default Dashboard;
