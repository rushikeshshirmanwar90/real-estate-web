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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Staff = {
    id: string
    name: string
    email: string
    phone: string
    position: string
    department: string
}

const data: Staff[] = [
    {
        id: "1",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "(123) 456-7890",
        position: "Sales Manager",
        department: "Sales",
    },
    {
        id: "2",
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        phone: "(234) 567-8901",
        position: "Property Agent",
        department: "Sales",
    },
    {
        id: "3",
        name: "David Chen",
        email: "david.chen@example.com",
        phone: "(345) 678-9012",
        position: "Financial Analyst",
        department: "Finance",
    },
    {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        phone: "(456) 789-0123",
        position: "Marketing Specialist",
        department: "Marketing",
    },
    {
        id: "5",
        name: "James Brown",
        email: "james.brown@example.com",
        phone: "(567) 890-1234",
        position: "Property Manager",
        department: "Operations",
    },
    {
        id: "6",
        name: "Linda Martinez",
        email: "linda.martinez@example.com",
        phone: "(678) 901-2345",
        position: "HR Manager",
        department: "Human Resources",
    },
    {
        id: "7",
        name: "Michael Lee",
        email: "michael.lee@example.com",
        phone: "(789) 012-3456",
        position: "IT Specialist",
        department: "IT",
    },
    {
        id: "8",
        name: "Jennifer Taylor",
        email: "jennifer.taylor@example.com",
        phone: "(890) 123-4567",
        position: "Property Agent",
        department: "Sales",
    },
]

export function StaffTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Staff>[] = [
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={row.getValue("name")} />
                        <AvatarFallback>
                            {(row.getValue("name") as string)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{row.getValue("name")}</div>
                </div>
            ),
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
            accessorKey: "position",
            header: "Position",
        },
        {
            accessorKey: "department",
            header: "Department",
            cell: ({ row }) => {
                const department = row.getValue("department") as string
                return (
                    <Badge
                        variant="outline"
                        className={
                            department === "Sales"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                : department === "Finance"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                    : department === "Marketing"
                                        ? "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800"
                                        : department === "Operations"
                                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                            : department === "Human Resources"
                                                ? "bg-pink-100 text-pink-800 hover:bg-pink-100 hover:text-pink-800"
                                                : "bg-slate-100 text-slate-800 hover:bg-slate-100 hover:text-slate-800"
                        }
                    >
                        {department}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const staff = row.original
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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.id)}>Copy staff ID</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit staff</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete staff</DropdownMenuItem>
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
                        placeholder="Search staff..."
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

