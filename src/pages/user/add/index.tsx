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

const formUser = z
    .object({
        username: z
            .string()
            .min(4, { message: "username must be at least 4 characters" }),
        name: z
            .string()
            .min(4, { message: "Name must be at least 4 characters" }),
        address: z.string(),
        company: z.string(),
        role: z.enum([Role.ADMIN, Role.COMPANY]),
        password: z
            .string()
            .min(4, { message: "Password must be at least 4 characters" }),
        repassword: z
            .string()
            .min(4, { message: "Repassword must be at least 4 characters" }),
    })
    .refine((data) => data.password === data.repassword, {
        message: "Password doesn't match",
        path: ["repassword"],
    });
const optionsRole = Object.values(Role);
const UserAddPage: NextPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formUser>>({
        resolver: zodResolver(formUser),
    });
    const { mutate: create, isLoading } = api.user.create.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Successfully insert data",
            });
            void router.push("/user");
        },
        onError: (err) => {
            toast({
                title: "Failed",
                description: err.message,
            });
        },
    });
    const onSubmit = (values: z.infer<typeof formUser>) => {
        const { username, address, company, password, name, role } = values;
        create({
            username,
            address,
            company,
            password,
            name,
            role,
        });
    };
    return (
        <Layout>
            <LayoutMaster title="Add New User Company">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full max-w-lg flex-col space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
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
                                            placeholder="company"
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
                                        <Textarea placeholder="" {...field} />
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
                                    <Select onValueChange={field.onChange}>
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="repassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Re-type Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="re-type password"
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
            </LayoutMaster>
        </Layout>
    );
};
export default UserAddPage;
