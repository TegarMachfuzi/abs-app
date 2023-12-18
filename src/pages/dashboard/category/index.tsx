import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import SideNav from "~/components/ui/SideNav";
import { Button } from "~/components/ui/button";
import {
    CategoryColumns,
    CategoryTable,
} from "~/components/table/category-columns";
import { DataTable } from "~/components/ui/data-tables";
import { LayoutDashboard } from "~/components/ui/layout";
import { api } from "~/utils/api";
import { useToast } from "~/hook/use-toast";
import { PlusIcon } from "lucide-react";

const CategoryPage: NextPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [categorys, setCategorys] = useState<CategoryTable[]>([]);
    const deleteCategory = api.category.deleteCategory.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Successfully deleting category",
            });
            void refetchCategory();
        },
    });

    const { refetch: refetchCategory, isFetching } =
        api.category.getAll.useQuery(undefined, {
            onSuccess: (data) => {
                setCategorys(
                    data.map(
                        (item) =>
                            ({
                                id: item.id,
                                name: item.name,
                                actionDelete: (id: string) => {
                                    deleteCategory.mutate({ id });
                                },
                                actionEdit: (id: string) => {
                                    void router.push(
                                        `/dashboard/category/edit/${item.id}`
                                    );
                                },
                            } as CategoryTable)
                    )
                );
            },
        });
    return (
        <div className="flex w-full items-start bg-white">
            <SideNav />
            <LayoutDashboard>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <div>Halaman Category</div>
                        <div>
                            <Button
                                className="gap-2"
                                onClick={() =>
                                    void router.push("/dashboard/category/add")
                                }
                            >
                                <PlusIcon />
                                Tambah Baru{" "}
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <DataTable
                            isFetching={isFetching}
                            columns={CategoryColumns}
                            data={categorys}
                        />
                    </div>
                </div>
            </LayoutDashboard>
        </div>
    );
};
export default CategoryPage;
