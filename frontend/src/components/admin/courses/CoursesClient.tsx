"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
// --- MODIFIED ICON IMPORT ---
import { 
    ArrowUpDown, 
    ChevronDown, 
    PlusCircle, 
    Eye,        // Added
    Pencil,     // Added
    Trash2      // Added
} from "lucide-react"

import { Button } from "@heroui/button"
import { Checkbox } from "@heroui/checkbox"
import {  Dropdown,  DropdownTrigger, DropdownSection,  DropdownItem, DropdownMenu} from "@heroui/dropdown";
import { Input } from "@heroui/input"
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
import {Chip} from "@heroui/chip";
import type { Course } from "./CreateCourseForm"; // Import Course type

export function CoursesClient({ data }: { data: Course[] }) {
    const router = useRouter();
    const { token } = useAuth();

    const handleDelete = async (courseId: string) => {
        const authToken = token || undefined;
        if (!window.confirm("Are you sure you want to delete this course and all its content?")) return;
        try {
            await api.delete(`/courses/${courseId}`, authToken);
            router.reload(); // Refresh the page
        } catch (error) {
            alert("Failed to delete course.");
            console.error(error);
        }
    };

    const columns: ColumnDef<Course>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    isSelected={table.getIsAllPageRowsSelected()} // Changed 'checked' to 'isSelected'
                    onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    isSelected={row.getIsSelected()} // Changed 'checked' to 'isSelected'
                    onChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onPress={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "category.name", // Access nested category name
            header: "Category",
            cell: ({ row }) => <div>{row.original.category?.name || 'N/A'}</div>,
        },
        {
            accessorKey: "pricing_model",
            header: "Pricing",
            cell: ({ row }) => {
                 const model = row.getValue("pricing_model") as string;
                 const price = row.original.sale_price ?? row.original.regular_price;
                 return (
                    <Chip variant={model === 'free' ? 'flat' : 'bordered'}>
                        {model === 'free' ? 'Free' : `Paid (₹${price || 'N/A'})`}
                    </Chip>
                 );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                 return <Chip color={status === 'published' ? 'default' : 'danger'} className={status === 'published' ? 'bg-green-400 text-green-900' : ''}>{status}</Chip>;
            }
        },
        // --- MODIFIED ACTIONS COLUMN ---
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const course = row.original;
                return (
                    <div className="flex gap-1 justify-end">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onPress={() => router.push(`/admin/courses/${course.id}`)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onPress={() => router.push(`/admin/courses/${course.id}/edit`)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600" 
                            onPress={() => handleDelete(course.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
        // --- END MODIFIED ACTIONS COLUMN ---
    ];

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 10, // Show 10 rows per page
            }
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter by title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                 <div className="flex items-center gap-2">
                    <Dropdown>
                        {/* --- REMOVED 'asChild' prop --- */}
                        <DropdownTrigger> 
                            <Button variant="bordered" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        // Note: Checkbox in DropdownItem might need custom styling
                                        <DropdownItem key={column.id}>
                                            <Checkbox
                                                key={column.id}
                                                className="capitalize"
                                                isSelected={column.getIsVisible()} // Changed 'checked' to 'isSelected'
                                                onChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {/* Added label text */}
                                                <span className="ml-2">
                                                    {column.id === 'category.name' ? 'Category' : column.id}
                                                </span>
                                            </Checkbox>
                                        </DropdownItem>
                                    )
                                })}
                        </DropdownMenu>
                    </Dropdown>
                    <Button className="bg-[#7828C8] text-white" onPress={() => router.push('/admin/courses/new')}>
                         <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
                    </Button>
                 </div>
            </div>
            <div className="rounded-md bg-white">
                <Table>
                    <TableHeader>
                        {/* Map headers from the first headerGroup directly to TableColumn */}
                        {table.getHeaderGroups()[0].headers.map((header) => (
                            <TableColumn key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-gray-500"> {/* Replaced muted-foreground */}
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="bordered"
                        size="sm"
                        onPress={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="bordered"
                        size="sm"
                        onPress={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}