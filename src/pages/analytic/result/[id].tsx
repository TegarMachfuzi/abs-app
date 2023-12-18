import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import _ from "underscore";
import BarChartSegment from "~/components/bar-chart";
import PieChartSegment from "~/components/pie-chart";
import { SummaryColumns } from "~/components/table/summary-columns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-tables";
import { Layout, LayoutMaster } from "~/components/ui/layout";
import { ChartSegmentationProps } from "~/type";
import { RouterOutputs, api } from "~/utils/api";

const ButtonPDF = dynamic(() => import("../../../components/pdf-generator"));
type SummaryCalculatedType = RouterOutputs["resultAnalytic"]["getSummary"];
const ResultAnalyticPage = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    const router = useRouter();
    const [dataBar, setDataBar] = useState<ChartSegmentationProps[]>([]);
    const id = router.query.id as string;
    const { data, isFetching: isFetchingSummary } =
        api.resultAnalytic.getSummary.useQuery(id, {
            enabled: id !== undefined,
        });
    const { data: analytic } = api.analytic.getAnalytic.useQuery(id, {
        enabled: id !== undefined,
    });

    useEffect(() => {
        if (data) {
            const temp: ChartSegmentationProps[] = [];
            for (const key in data.segmentation) {
                if (
                    Object.prototype.hasOwnProperty.call(data.segmentation, key)
                ) {
                    const element = data.segmentation[key];
                    temp.push({
                        name: key,
                        Segmentation: element?.length ?? 0,
                    });
                }
            }
            setDataBar(temp);
        }
    }, [data]);
    return (
        <Layout>
            <LayoutMaster
                ref={ref}
                className="bg-black"
                title={`Result Analytic`}
                headerComponent={
                    <div className="flex flex-col gap-3">
                        <DateCreated
                            id={id}
                            date={analytic?.createdDate ?? new Date()}
                        />

                        <div className="flex justify-end">
                            {ref && <ButtonPDF html={ref} />}
                        </div>
                    </div>
                }
            >
                {/* Card Wrapper */}
                {data && <WrapperCardSegmentation data={data} />}
                {/* Bar Chart */}
                {dataBar.length ? (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex">
                            <p className="text-2xl font-semibold">Charts</p>
                        </div>
                        <div className="flex w-full gap-3">
                            <BarChartSegment data={dataBar} />
                            <PieChartSegment data={dataBar} />
                        </div>
                    </div>
                ) : null}
                <DataTable
                    columns={SummaryColumns}
                    data={
                        data?.summary?.map(({ rank, ...item }) => ({
                            segmentation: item.label,
                            ...item,
                        })) ?? []
                    }
                    isFetching={isFetchingSummary}
                    pagination
                />
            </LayoutMaster>
        </Layout>
    );
};
export default ResultAnalyticPage;

const DateCreated: React.FC<{ date: Date; id: string }> = ({ date, id }) => {
    return (
        <div className="h-full w-fit whitespace-nowrap text-right">
            <p>Created At {dayjs(date).format("MMMM D, YYYY")}</p>
            <p className="text-sm text-neutral-500">ID Analytic {id}</p>
        </div>
    );
};
interface CardSegmentationProps {
    title: string;
    totalCustomer: number;
    percentage?: string;
}
const CardSegmentation: React.FC<CardSegmentationProps> = ({
    percentage,
    title,
    totalCustomer,
}) => {
    return (
        <Card className="w-full max-w-xs pb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {totalCustomer} Customers
                </div>
                {percentage && (
                    <p className="text-xs text-muted-foreground">
                        {percentage}% from all data
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

const WrapperCardSegmentation: React.FC<{
    data: SummaryCalculatedType;
}> = ({ data: prop }) => {
    const { segmentation, summary } = prop;
    const [data, setData] = useState<CardSegmentationProps[]>([]);

    useEffect(() => {
        const temp: CardSegmentationProps[] = [];
        for (const key in segmentation) {
            const element = segmentation[key];
            temp.push({
                title: key,
                totalCustomer: element?.length ?? 0,
                percentage: (
                    ((element?.length ?? 0) * 100) /
                    summary.length
                ).toFixed(2),
            });
        }
        setData(temp);
    }, [prop]);
    return (
        <div className="flex w-full flex-wrap gap-3">
            {data.map(({ title, percentage, totalCustomer }) => (
                <CardSegmentation
                    key={title}
                    title={title}
                    totalCustomer={totalCustomer}
                    percentage={percentage}
                />
            ))}
            <CardSegmentation
                key={"totalCustomer"}
                title="Total Customer"
                totalCustomer={summary.length}
            />
        </div>
    );
};
