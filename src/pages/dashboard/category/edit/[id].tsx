import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SideNav from "~/components/ui/SideNav";
import { LayoutDashboard } from "~/components/ui/layout";
import { api } from "~/utils/api";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hook/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftIcon } from "lucide-react";

const CategoryEditPage: NextPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { id } = router.query;

    const formCategory = z.object({
        name: z.string(),
    });
    const { mutate: edit, isLoading } = api.category.updateCategory.useMutation(
        {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Successfully edit category",
                });
                void router.push("/dashboard/category");
            },
        }
    );
    const form = useForm<z.infer<typeof formCategory>>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(formCategory),
    });
    const onSubmit = (values: z.infer<typeof formCategory>) => {
        const { name } = values;
        edit({ id: String(id), name });
    };
    const { isFetching } = api.category.getOne.useQuery(String(id), {
        onSuccess: (data) => {
            form.setValue("name", data?.name || "");
        },
    });
    return (
        <div className="flex w-full items-start bg-white">
            <SideNav />
            <LayoutDashboard>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-start">
                        <Button variant={"ghost"} onClick={router.back}>
                            <ArrowLeftIcon size={"20"} />
                        </Button>
                        <div>Edit Menu</div>
                    </div>
                    <div className="flex justify-center rounded-sm border p-5">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex w-full max-w-lg flex-col space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Category Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    isLoading={isLoading || isFetching}
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </LayoutDashboard>
        </div>
    );
};
export default CategoryEditPage;
