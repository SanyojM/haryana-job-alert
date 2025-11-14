"use client"

import * as React from "react"
import { useRouter } from "next/router"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import {
  Column,
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@heroui/button"
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@heroui/dropdown";
import { Input } from "@heroui/input"
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
import { Post } from "@/pages/admin/posts"

export function PostsClient({ data }: { data: Post[] }) {
  const router = useRouter();
  const { token } = useAuth();

  const handleDelete = async (postId: string) => {
    const authToken = token || undefined;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`, authToken);
      router.reload();
    } catch (error) {
      alert("Failed to delete post.");
      console.error(error);
    }
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "categories.name",
      header: "Category",
      cell: ({ row }) => <div>{row.original.categories?.name || 'Uncategorized'}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      sortDescFirst: true,
      cell: ({ row }) => (
        <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const post = row.original;
        return (
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownSection title="Actions">
              <DropdownItem key='new' onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                Edit Post
              </DropdownItem>
              <DropdownItem key='file' className="text-red-500" onClick={() => handleDelete(post.id)}>
                Delete Post
              </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")

  // Get unique categories from data
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    data.forEach(post => {
      if (post.categories?.name) {
        uniqueCategories.add(post.categories.name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [data]);

  // Filter data based on category
  const filteredData = React.useMemo(() => {
    if (categoryFilter === "all") return data;
    return data.filter(post => post.categories?.name === categoryFilter);
  }, [data, categoryFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    // UPDATED SECTION: Removed 'enableMultiSort: true'
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  // UPDATED SECTION: Removed the complex 'handleSortToggle' function

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
        {/* Category Filter Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <Button className="min-w-[180px]">
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <>
              <DropdownItem
                key="all"
                onClick={() => setCategoryFilter("all")}
              >
                All Categories
              </DropdownItem>
              {categories.map((category) => (
                <DropdownItem
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownItem>
              ))}
            </>
          </DropdownMenu>
        </Dropdown>

        {/* Sort Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <Button className="ml-auto">
              Sort by... <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <>
              <DropdownItem
                key="created_at_desc"
                onClick={() => {
                  table.getColumn("created_at")?.toggleSorting(true);
                }}
              >
                Date Created (Newest First)
                {table.getColumn("created_at")?.getIsSorted() === "desc" && " ✓"}
              </DropdownItem>
              <DropdownItem
                key="created_at_asc"
                onClick={() => {
                  table.getColumn("created_at")?.toggleSorting(false);
                }}
              >
                Date Created (Oldest First)
                {table.getColumn("created_at")?.getIsSorted() === "asc" && " ✓"}
              </DropdownItem>
              <DropdownItem
                key="title_asc"
                onClick={() => {
                  table.getColumn("title")?.toggleSorting(false);
                }}
              >
                Title (A-Z)
                {table.getColumn("title")?.getIsSorted() === "asc" && " ✓"}
              </DropdownItem>
              <DropdownItem
                key="title_desc"
                onClick={() => {
                  table.getColumn("title")?.toggleSorting(true);
                }}
              >
                Title (Z-A)
                {table.getColumn("title")?.getIsSorted() === "desc" && " ✓"}
              </DropdownItem>
            </>
          </DropdownMenu>
        </Dropdown>
      </div>
        <Table>
        <TableHeader>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            size="sm"
            onPress={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
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