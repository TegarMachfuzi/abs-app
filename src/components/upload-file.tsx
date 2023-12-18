import { FileIcon } from "lucide-react";
import Papa from "papaparse";
import { useRef, useState } from "react";
import _ from "underscore";
import { useToast } from "~/hook/use-toast";
import { AnalyticForm } from "~/type";
import { api } from "~/utils/api";
import { strToDate } from "~/utils/date-utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { useRouter } from "next/router";

const UploadFile = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();
    const [selectedFileName, setSelectedFileName] = useState<string>("");
    const router = useRouter();

    // api calculate analytic
    const { mutateAsync: summaryAnalytic } =
        api.analytic.summaryAnalytic.useMutation({
            onSuccess: (data) => {
                setLoading(false);
                toast({
                    title: "Successfully Import Data",
                    description: "Redirect to result Analytic",
                });
                router.push(`/analytic/result/${data}`);
            },
        });
    const { mutateAsync: initAnalytic } =
        api.analytic.initAnalytic.useMutation();
    const { mutateAsync: importAnalytic } =
        api.analytic.importAnalytic.useMutation({});

    const handleFileChange = () => {
        const input = fileRef?.current;
        if (input?.files && input.files.length > 0) {
            setSelectedFileName(input.files[0]?.name ?? "");
        }
    };

    const handleUploadCsv = () => {
        setLoading(true);
        const input = fileRef?.current;
        if (!input) return;
        const reader = new FileReader();
        const file = input.files?.[0];
        if (file) {
            reader.onloadend = ({ target }) => {
                const csv = Papa.parse(target?.result as string, {
                    header: true,
                });
                if (csv.data && csv.data.length > 0) {
                    try {
                        const parsedData: AnalyticForm[] = csv.data.map(
                            (item: any) => ({
                                custId: item.CustId,
                                name: item.Name,
                                date: strToDate(item.Date),
                                items: item.Items,
                                netSales: parseFloat(item.NetSales),
                                salesType: item.SalesType,
                            })
                        );
                        processData(parsedData);
                    } catch (err) {
                        console.log(err);
                        toast({
                            title: "Error",
                            description: "Format csv incorrect.",
                        });
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const processData = async (data: AnalyticForm[]) => {
        const analyticId = await initAnalytic();
        const chunkedArray = _.chunk(data, 1000);
        let prog = 0;
        for (let index = 0; index < chunkedArray.length; index++) {
            const item = chunkedArray[index];
            if (item) {
                await importAnalytic({ analyticId, data: item }).then(() => {
                    const total = (item.length * 100) / data.length;
                    prog += total;
                    setProgress(prog);
                });
            }
        }
        await summaryAnalytic(analyticId);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="gap-2">
                    New Analytic <FileIcon size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex h-fit max-w-xl flex-col items-center justify-center gap-3 p-6">
                    <label className="flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed px-4 transition hover:border-gray-400 focus:outline-none">
                        {selectedFileName ? (
                            <span className="flex items-center space-x-2">
                                <span className="font-medium ">
                                    {selectedFileName}
                                </span>
                            </span>
                        ) : (
                            <span className="flex items-center space-x-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 "
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <span className="font-medium ">
                                    <span className="text-blue-600 underline">
                                        Browse
                                    </span>{" "}
                                    file csv
                                </span>
                            </span>
                        )}
                        <Input
                            ref={fileRef}
                            type="file"
                            onChange={handleFileChange}
                            name="file_upload"
                            className="hidden"
                        />
                    </label>
                    <Button
                        variant={"outline"}
                        className="w-full"
                        isLoading={loading}
                        onClick={handleUploadCsv}
                        disabled={!selectedFileName ? true : false}
                    >
                        Upload
                    </Button>

                    {loading && <Progress value={progress} />}
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default UploadFile;
