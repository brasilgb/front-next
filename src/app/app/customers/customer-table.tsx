"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { useDebounce } from "@/hooks/use-debounce"

interface Props<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  total: number
  page: number
  pageSize: number
  search: string
}

export default function CustomersTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  search,
}: Props<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(search)
  const [isTyping, setIsTyping] = useState(false)

  const debouncedSearch = useDebounce(value, 500)

  function navigate(params: Partial<{ page: number; pageSize: number; search: string }>) {
    const query = new URLSearchParams({
      page: String(params.page ?? page),
      pageSize: String(params.pageSize ?? pageSize),
      search: params.search ?? search,
      sortBy: searchParams.get("sortBy") ?? "",
      sortDir: searchParams.get("sortDir") ?? "",
    })

    router.push(`/app/customers?${query.toString()}`)
  }

  // Debounce automático
  useEffect(() => {
    if (debouncedSearch !== search) {
      setIsTyping(false)
      navigate({ page: 1, search: debouncedSearch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setIsTyping(false)
      navigate({ page: 1, search: value })
    }
  }

  function handleSearchChange(val: string) {
    setIsTyping(true)
    setValue(val)
  }

  function clearSearch() {
    setValue("")
    setIsTyping(false)
    navigate({ page: 1, search: "" })
  }

  const sorting: SortingState = searchParams.get("sortBy")
    ? [
        {
          id: searchParams.get("sortBy")!,
          desc: searchParams.get("sortDir") === "desc",
        },
      ]
    : []

  function handleSortingChange(next: SortingState) {
    if (!next.length) return

    const { id, desc } = next[0]

    const query = new URLSearchParams({
      page: "1",
      pageSize: String(pageSize),
      search,
      sortBy: id,
      sortDir: desc ? "desc" : "asc",
    })

    router.push(`/app/customers?${query.toString()}`)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      page={page}
      pageSize={pageSize}
      searchValue={value}
      onSearchChange={handleSearchChange}
      onSearchKeyDown={handleKeyDown}
      onClearSearch={clearSearch}
      isLoading={isTyping}
      onPageChange={(p) => navigate({ page: p })}
      placeholder="nome e CPF/CNPJ"
      addButton={{
        text: "Novo Cliente",
        url: "/app/customers/create",
      }}
      sorting={sorting}
      onSortingChange={handleSortingChange}
    />
  )
}
