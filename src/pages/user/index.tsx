import { PlusIcon } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { UserColumns, UserTable } from "~/components/table/user-columns";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-tables";
import { Layout, LayoutMaster } from "~/components/ui/layout";
import { useToast } from "~/hook/use-toast";
import { api } from "~/utils/api";

const UserPage: NextPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [data, setData] = useState<UserTable[]>([]);
    const { mutate: deleteUser } = api.user.delete.useMutation({
        onSuccess: () => {
            void refetch();
            toast({
                title: "Success",
                description: "Successfully delete data",
            });
        },
        onError: (err) => {
            toast({
                title: "Failed",
                description: `Something is wrong please try again 😭, ${err.message}`,
            });
        },
    });

    const { refetch, isFetching } = api.user.getAll.useQuery(undefined, {
        onSuccess: (response) => {
            setData(
                response.map((item) => ({
                    id: item.id,
                    name: item.name,
                    username: item.username,
                    address: item.address,
                    company: item.company,
                    role: item.role,
                    actionEdit: (id: string) => {
                        void router.push(`/user/edit/${id}`);
                    },
                    actionDelete: (id: string) => {
                        deleteUser({
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
                title="User Company"
                headerComponent={
                    <Button
                        className="gap-2"
                        onClick={() => void router.push("/user/add")}
                    >
                        <PlusIcon />
                        Tambah Baru
                    </Button>
                }
            >
                <DataTable
                    isFetching={isFetching}
                    columns={UserColumns}
                    data={data}
                    pagination
                />
            </LayoutMaster>
        </Layout>
    );
};
export default UserPage;
