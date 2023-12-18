"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { generateId } from "~/utils/string-utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isFetching?: boolean;
    pagination?: boolean;
    showFooter?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isFetching: isLoading,
    pagination,
    showFooter,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });

    return (
        <div className="rounded-md border">
            <div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading && !table.getRowModel().rows?.length ? (
                            Array.from(Array(3).keys()).map((row) => (
                                <TableRow key={row}>
                                    {columns.map((cell) => (
                                        <TableCell key={generateId()}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow key={"noresult"}>
                                <TableCell
                                    key={"noKey"}
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {showFooter ? (
                        <TableFooter className="border-t ">
                            {table.getFooterGroups().map((footerGroup) => (
                                <TableRow key={footerGroup.id}>
                                    {footerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .footer,
                                                      header.getContext()
                                                  )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableFooter>
                    ) : null}
                </Table>
            </div>
            {pagination && (
                <div className="mr-4 flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <p className="text-sm text-neutral-400">{`${
                        table.getState().pagination.pageIndex + 1
                    } of ${table.getPageCount()}`}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
