import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hook/use-toast";
import { api } from "~/utils/api";


const formSegment = z
    .object({
        labelName: z.string(),
        description: z.string(),
        minRecency: z
        .number()
        .or(z.string().regex(/\d+/).transform(Number))
        .refine((n) => n >= 1 && n <= 5, {
            message: 'Score di batasi 1 sampai dengan 5 saja'
        }),
        minFrequency: z
        .number()
        .or(z.string().regex(/\d+/).transform(Number))
        .refine((n) => n >= 1 && n <= 5, {
            message: 'Score di batasi 1 sampai dengan 5 saja'
        }),
        minMonetary: z
        .number()
        .or(z.string().regex(/\d+/).transform(Number))
        .refine((n) => n >= 1 && n <= 5, {
            message: 'Score di batasi 1 sampai dengan 5 saja'
        }),
    })

const UserAddPage: NextPage = () => {
    const router = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof formSegment>>({
        resolver: zodResolver(formSegment),
    })
    const {mutate: create, isLoading} = api.segmentation.create.useMutation({
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Successfully insert data",
            });
            void router.push("/configuration")
        },
        onError: (err) => {
            toast({
                title:"Failed",
                description: err.message,
            })
        }
    });
    const onSubmit = (values: z.infer<typeof formSegment>) => {
        const {labelName, description, minRecency, minFrequency, minMonetary} = values;
        create({
            labelName,
            description,
            minRecency,
            minFrequency,
            minMonetary,
        });
    };
    return (
        <Layout>
            <LayoutMaster title="Add New Segmentation Config">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full max-w-lg flex-col space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="labelName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Label Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                      <FormField
                                control={form.control}
                                name="minRecency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recency Scores</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Recency Scores"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="minFrequency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frequency Scores</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Frequency Scores"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="minMonetary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monetary Scores</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Monetary Scores"
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
    )
}

export default UserAddPage