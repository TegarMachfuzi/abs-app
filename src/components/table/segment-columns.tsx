"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { UserType } from "~/server/api/routers/user";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert";
import AlertDelete from "../alert-delete";
import { SegmentationType } from "~/server/api/routers/segmentation";

export interface SegmentTable extends SegmentationType {
    actionEdit: (id: string) => void;
    actionDelete: (id: string) => void;
}

export const SegmentColumns: ColumnDef<SegmentTable>[] = [
    {
        accessorKey: "labelName",
        header: "Label Name"
    },
    {
        accessorKey: "minRecency",
        header: "Recency Scores"
    },
    {
        accessorKey: "minFrequency",
        header: "Frequency Scores"
    },
    {
        accessorKey: "minMonetary",
        header: "Monetary Scores"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        id: "actions",
        cell: ({row}) => {
            const action = row.original;
            return (
                <DropdownMenu>
                    <AlertDialog>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => action.actionEdit(action.id)}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                                <AlertDialogTrigger className="flex w-full justify-start">
                                    Delete
                                </AlertDialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        <AlertDelete
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. This will permanently delete your
            account and remove your data from our servers."
                            onAction={() => action.actionDelete(action.id)}
                        >
                            Delete
                        </AlertDelete>
                    </AlertDialog>
                </DropdownMenu>
            )
        }
    }
]