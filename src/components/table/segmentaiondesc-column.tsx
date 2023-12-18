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
import { SegmentationDescType } from "~/server/api/routers/segmentationdesc";

export interface SegmentDescTable extends SegmentationDescType {
    
}

export const SegmentColumnsDesc: ColumnDef<SegmentDescTable>[] = [
    {
        accessorKey: "segment",
        header: "Segment"
    },
    {
        accessorKey: "activity",
        header: "Activity"
    },
    {
        accessorKey: "actionableTip",
        header: "Actionable Tip"
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
                    </AlertDialog>
                </DropdownMenu>
            )
        }
    }
]