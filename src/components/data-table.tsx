"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, X } from "lucide-react"

interface DataTableProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  total: number
  page: number
  pageSize: number
  searchValue: string
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  placeholder: string
  addButton?: {
    text: string
    url: string
  }
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClearSearch?: () => void
  isLoading?: boolean
  sorting?: SortingState
  onSortingChange?: (state: SortingState) => void
}

function getPaginationRange(
  current: number,
  total: number,
  delta = 2
) {
  const range: number[] = []
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)

  for (let i = start; i <= end; i++) range.push(i)
  return range
}

export function DataTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  searchValue,
  onSearchChange,
  onPageChange,
  onSearchKeyDown,
  onClearSearch,
  placeholder,
  addButton,
  isLoading,
  sorting = [],
  onSortingChange,
}: DataTableProps<T>) {

  const pageCount = Math.ceil(total / pageSize)
  const pages = getPaginationRange(page, pageCount)

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex: page - 1, // TanStack é 0-based
        pageSize,
      },
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      {/* Busca + botão */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative md:w-80">
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder={placeholder}
            className="w-full pr-10"
          />

          {searchValue && (
            <button
              onClick={onClearSearch}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin">
              ⏳
            </span>
          )}
        </div>

        {addButton && (
          <Link href={addButton.url}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {addButton.text}
            </Button>
          </Link>
        )}
      </div>

      {/* TABELA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc" && " ↑"}
                    {header.column.getIsSorted() === "desc" && " ↓"}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
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
                <TableCell colSpan={columns.length} className="text-center py-6">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex items-center justify-between text-sm">
        <span>
          Página <strong>{page}</strong> de <strong>{pageCount}</strong> —{" "}
          Total <strong>{total}</strong> registros
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>

          {page > 3 && (
            <>
              <Button size="sm" variant="outline" onClick={() => onPageChange(1)}>
                1
              </Button>
              <span>…</span>
            </>
          )}

          {pages.map(p => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "default" : "outline"}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}

          {page < pageCount - 2 && (
            <>
              <span>…</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(pageCount)}
              >
                {pageCount}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
