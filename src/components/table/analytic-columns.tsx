"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { AnalyticsDtoType } from "~/type";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatedDate } from "~/lib/utils";

export interface AnalyticsTable extends AnalyticsDtoType {
    actionView: (id: string) => void;
}
export const AnalyticColumns: ColumnDef<AnalyticsTable>[] = [
    {
        accessorKey: "id",
        header: "ID Analytic",
    },
    {
        accessorKey: "detailAnalytic",
        header: "Total Record",
    },
    {
        accessorKey: "totalCustomer",
        header: "Total Customer",
    },
    {
        accessorKey: "createdDate",
        header: "Created Date",
        cell: ({ row }) => {
            return formatedDate(row.original.createdDate);
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const action = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => action.actionView(action.id)}
                        >
                            View Detail
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
