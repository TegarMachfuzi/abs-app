import { EggIcon } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import {SegmentColumnsDesc, SegmentDescTable } from "~/components/table/segmentaiondesc-column";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Layout, LayoutMaster } from "~/components/ui/layout";
import { api } from "~/utils/api";
import { DataTable } from "~/components/ui/data-tables";

const HomePage: NextPage = () => {
    const router = useRouter();
    const[data, setData] = useState<SegmentDescTable[]>([]);

    const {refetch, isFetching} = api.segmentationDesc.getAll.useQuery(undefined, {
        onSuccess: (response) => {
            setData(
                response.map((item) => ({
                    id: item.id,
                    segment: item.segment,
                    activity: item.activity,
                    actionableTip: item.actionableTip,
                }))
            );
        },
    });
    return (
        <Layout>
            <LayoutMaster
                title="Segmentation Description"
            >
                <DataTable
                    isFetching={isFetching}
                    columns={SegmentColumnsDesc}
                    data={data}
                    pagination
                />
               
            </LayoutMaster>
        </Layout>
    );
};
export default HomePage;
