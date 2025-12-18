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
import { PlusCircle, X, Loader2 } from "lucide-react"
import { DataTableSkeleton } from "./data-table-skeleton"

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
  isSearching?: boolean
  isPageLoading?: boolean
}

function getPaginationRange(current: number, total: number, delta = 2) {
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
  isSearching,
  isPageLoading
}: DataTableProps<T>) {
  const pageCount = Math.ceil(total / pageSize)
  const pages = getPaginationRange(page, pageCount)

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

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

          {isSearching && (
            <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {addButton && (
          <Link href={addButton.url}>
            <Button disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {addButton.text}
            </Button>
          </Link>
        )}
      </div>

      {/* Tabela */}
      <div
        className={`rounded-md border transition-opacity duration-200 ${isPageLoading ? "opacity-60 pointer-events-none" : ""
          }`}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => {
                  const canSort = header.column.getCanSort()
                  const sortState = header.column.getIsSorted()

                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={
                        canSort
                          ? "cursor-pointer select-none"
                          : "select-none text-muted-foreground"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {canSort && (
                          <>
                            {sortState === "asc" && <span>↑</span>}
                            {sortState === "desc" && <span>↓</span>}
                            {sortState === false && (
                              <span className="opacity-50">↕</span>
                            )}
                          </>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isPageLoading ? (
              <DataTableSkeleton
                columns={columns.length}
                rows={pageSize}
              />
            ) : rows.length ? (
              rows.map(row => (
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

      {/* Paginação */}
      <div className="flex items-center justify-between text-sm">
        <span>
          Página <strong>{page}</strong> de <strong>{pageCount}</strong> — Total{" "}
          <strong>{total}</strong> registros
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>

          {page > 3 && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => onPageChange(1)}
              >
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
              disabled={isLoading}
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
                disabled={isLoading}
                onClick={() => onPageChange(pageCount)}
              >
                {pageCount}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isPageLoading}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
