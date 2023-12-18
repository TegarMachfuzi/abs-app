import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import SideNav from "~/components/ui/SideNav";
import { Button } from "~/components/ui/button";
import { SegmentColumns, SegmentTable } from "~/components/table/segment-columns";
import { DataTable } from "~/components/ui/data-tables";
import { Layout, LayoutDashboard, LayoutMaster } from "~/components/ui/layout";
import { useToast } from "~/hook/use-toast";
import { PlusIcon } from "lucide-react";
import { api } from "~/utils/api";

const SegmentPage: NextPage = () => {
    const router = useRouter();
    const {toast} = useToast();
    const [data, setData] = useState<SegmentTable[]>([]);
    const {mutate: deleteSegment} = api.segmentation.deleteSegment.useMutation({
        onSuccess: () => {
            void refetch();
            toast({
                title: "Success",
                description: "Succesfully delete data",
            });
        },
        onError: (err) => {
            toast({
                title: "Failed",
                description: `Something is wrong please try again, ${err.message}`,
            });
        },
    });

    const {refetch, isFetching} = api.segmentation.getAll.useQuery(undefined, {
        onSuccess: (response) => {
            setData(
                response.map((item) =>({
                    id: item.id,
                    labelName: item.labelName,
                    description: item.description,
                    minRecency: item.minRecency,
                    minFrequency: item.minFrequency,
                    minMonetary: item.minMonetary,
                    actionEdit: (id: string) => {
                        void router.push(`/configuration/edit/${id}`);
                    },
                    actionDelete: (id: string) => {
                        deleteSegment({
                            id,
                        });
                    },
                }))
            );
        },
        onError: (err) => {
            toast({
                title: "Error",
                description: err.message,
            });
        },
    });
    return (
        <Layout>
            <LayoutMaster
                title="Segmentation Config"
                headerComponent={
                    <Button
                        className="gap-2"
                        onClick={() => void router.push("/configuration/add")}
                    >
                        <PlusIcon />
                        Tambah Baru
                    </Button>
                }
            >
                <DataTable
                    isFetching={isFetching}
                    columns={SegmentColumns}
                    data={data}
                    pagination
                />
            </LayoutMaster>
        </Layout>
    );

};

export default SegmentPage;