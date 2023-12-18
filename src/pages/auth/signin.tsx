import { zodResolver } from "@hookform/resolvers/zod";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hook/use-toast";

const formLogin = z.object({
    username: z.string(),
    password: z.string(),
    csrfToken: z.string().optional(),
});
export default function SignIn({
    csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const form = useForm<z.infer<typeof formLogin>>({
        defaultValues: {
            csrfToken: csrfToken,
        },
        resolver: zodResolver(formLogin),
    });
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: z.infer<typeof formLogin>) => {
        setLoading(true);
        signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
        })
            .then((resp) => {
                setLoading(false);
                if (resp?.ok) {
                    toast({
                        title: "Success Signin",
                        description: "Selamat Datang!",
                    });

                    router.push("/");
                    return;
                }
                toast({
                    title: "Failed",
                    description: `Username or Password is incorrect`,
                });
            })
            .catch((err) => {
                setLoading(false);
                toast({
                    title: "Failed",
                    description: `Username or Password is incorrect`,
                });
            });
    };
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full max-w-lg rounded-lg border py-12">
                <Form {...form}>
                    <form
                        className="flex min-w-full flex-col space-y-4 px-24"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <p className="text-3xl font-bold">Sign in</p>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Passwrod"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            isLoading={loading}
                            type="submit"
                            className="font-bold"
                        >
                            Sign in
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req } = context;
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: "/" },
        };
    }
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}
