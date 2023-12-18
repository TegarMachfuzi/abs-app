import { ColumnDef } from "@tanstack/react-table";
import { SummaryAnalyticDto } from "~/type";

export const SummaryColumns: ColumnDef<SummaryAnalyticDto>[] = [
    {
        accessorKey: "customerName",
        header: "Customer Name",
    },
    {
        accessorKey: "recency",
        header: "Recency",
    },
    {
        accessorKey: "frequency",
        header: "Frequency",
    },
    {
        accessorKey: "monetary",
        header: "Monetary",
    },
    {
        accessorKey: "recencyScore",
        header: "Recency Score",
    },
    {
        accessorKey: "frequencyScore",
        header: "Frequency Score",
    },
    {
        accessorKey: "monetaryScore",
        header: "Monetary Score",
    },
    {
        accessorKey: "segmentation",
        header: "Segmentation",
    },
];
