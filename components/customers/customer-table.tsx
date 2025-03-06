"use client"

import { useState } from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Customer = {
    id: string
    name: string
    email: string
    phone: string
    ownedFlat: string
    status: "active" | "inactive" | "pending"
}

const data: Customer[] = [
    {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(123) 456-7890",
        ownedFlat: "Apartment 101, Tower A",
        status: "active",
    },
    {
        id: "2",
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        phone: "(234) 567-8901",
        ownedFlat: "Villa 15, Palm Residences",
        status: "active",
    },
    {
        id: "3",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "(345) 678-9012",
        ownedFlat: "Penthouse 3, Skyline Towers",
        status: "inactive",
    },
    {
        id: "4",
        name: "Sarah Davis",
        email: "sarah.davis@example.com",
        phone: "(456) 789-0123",
        ownedFlat: "Apartment 205, Riverside Complex",
        status: "active",
    },
    {
        id: "5",
        name: "David Wilson",
        email: "david.wilson@example.com",
        phone: "(567) 890-1234",
        ownedFlat: "House 7, Green Valley",
        status: "pending",
    },
    {
        id: "6",
        name: "Jennifer Martinez",
        email: "jennifer.martinez@example.com",
        phone: "(678) 901-2345",
        ownedFlat: "Apartment 310, City View",
        status: "active",
    },
    {
        id: "7",
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        phone: "(789) 012-3456",
        ownedFlat: "Duplex 2A, Sunset Boulevard",
        status: "inactive",
    },
    {
        id: "8",
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        phone: "(890) 123-4567",
        ownedFlat: "Apartment 412, Marina Heights",
        status: "active",
    },
    {
        id: "9",
        name: "James Thomas",
        email: "james.thomas@example.com",
        phone: "(901) 234-5678",
        ownedFlat: "Villa 23, Mountain View",
        status: "pending",
    },
    {
        id: "10",
        name: "Patricia Jackson",
        email: "patricia.jackson@example.com",
        phone: "(012) 345-6789",
        ownedFlat: "Penthouse 5, Ocean Towers",
        status: "active",
    },
]

export function CustomerTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "ownedFlat",
            header: "Property",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate" title={row.getValue("ownedFlat")}>
                    {row.getValue("ownedFlat")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <Badge
                        variant={status === "active" ? "default" : status === "pending" ? "outline" : "secondary"}
                        className={
                            status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                : status === "pending"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-100 hover:text-slate-800"
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const customer = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
                                Copy customer ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit customer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete customer</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}
