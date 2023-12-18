import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AnalyticColumns } from "~/components/table/analytic-columns";
import { DataTable } from "~/components/ui/data-tables";
import { Layout, LayoutMaster } from "~/components/ui/layout";
import { api } from "~/utils/api";
const AnalyticPage: NextPage = () => {
    const UploadFile = dynamic(() => import("~/components/upload-file"), {
        ssr: false,
    });
    const router = useRouter();
    const { isFetching, data: histories } = api.analytic.getHistory.useQuery();
    return (
        <Layout>
            <LayoutMaster
                title="History Analytics"
                headerComponent={<UploadFile />}
            >
                <DataTable
                    columns={AnalyticColumns}
                    data={
                        histories?.map((item) => ({
                            ...item,
                            actionView: (id: string) =>
                                router.push(`/analytic/result/${id}`),
                        })) ?? []
                    }
                    pagination
                    isFetching={isFetching}
                />
            </LayoutMaster>
        </Layout>
    );
};
export default AnalyticPage;
