import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SideNav from "~/components/ui/SideNav";
import { Button } from "~/components/ui/button";
import { LayoutDashboard } from "~/components/ui/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useToast } from "~/hook/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftIcon } from "lucide-react";

const formCategory = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});
const CategoryAddPage: NextPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formCategory>>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(formCategory),
    });
    const { mutate: create, isLoading } =
        api.category.createCategory.useMutation({
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Successfully adding category",
                });
                void router.push("/dashboard/category");
            },
        });
    const onSubmit = (values: z.infer<typeof formCategory>) => {
        const { name } = values;
        create({ name });
    };
    return (
        <div className="flex w-full items-start bg-white">
            <SideNav />
            <LayoutDashboard>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-start">
                        <Button variant={"ghost"} onClick={router.back}>
                            <ArrowLeftIcon size={"20"} />
                        </Button>
                        <div>Tambah Category</div>
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
                                                    placeholder="Name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button isLoading={isLoading} type="submit">
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
export default CategoryAddPage;
