import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Layout, LayoutMaster } from "~/components/ui/layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hook/use-toast";
import { api } from "~/utils/api";

const formUser = z.object({
    username: z.string(),
    address: z.string(),
    company: z.string(),
    name: z.string(),
    role: z.enum([Role.ADMIN, Role.COMPANY]),
});
const optionsRole = Object.values(Role);
const UserEditPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formUser>>({
        resolver: zodResolver(formUser),
    });
    const { mutate: update, isLoading } = api.user.update.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Successfully update data",
            });
            void router.push("/user");
        },
    });
    const onSubmit = (values: z.infer<typeof formUser>) => {
        const { username, address, company, name, role } = values;
        update({
            username,
            address,
            company,
            name,
            role,
        });
    };
    const { isFetching: isFetchingData } = api.user.findById.useQuery(
        String(id),
        {
            onSuccess: (data) => {
                form.setValue("name", data.name || "");
                form.setValue("address", data.address || "");
                form.setValue("company", data.company || "");
                form.setValue("username", data.username || "");
                form.setValue("role", data.role || "");
            },
        }
    );
    return (
        <Layout>
            <LayoutMaster title="Update User Company">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full max-w-lg flex-col space-y-4"
                    >
                        <FormField
                            disabled
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Company"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role User</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {optionsRole.map(
                                                (option, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            isLoading={isLoading || isFetchingData}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </LayoutMaster>
        </Layout>
    );
};
export default UserEditPage;
