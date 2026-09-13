"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SeverityBadge } from "@/components/intelligence/severity-badge";
import { StatusBadge } from "@/components/intelligence/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/format";
import { entityTypeLabel, exceptionTypeLabel } from "@/lib/wms/labels";
import type { PersistedException } from "@/types/exception";

const SEVERITY_RANK: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

const columnHelper = createColumnHelper<PersistedException>();

export function ExceptionTable({ exceptions }: { exceptions: PersistedException[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "detectedAt", desc: true }]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => exceptionTypeLabel(row.type), {
        id: "type",
        header: "Exception",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium">{exceptionTypeLabel(row.original.type)}</div>
            <div className="truncate text-xs text-muted-foreground">{row.original.exceptionId}</div>
          </div>
        ),
      }),
      columnHelper.accessor("severity", {
        header: "Severity",
        sortingFn: (a, b) => SEVERITY_RANK[a.original.severity] - SEVERITY_RANK[b.original.severity],
        cell: ({ getValue }) => <SeverityBadge severity={getValue()} />,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      }),
      columnHelper.accessor("entityId", {
        header: "Affected Entity",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate font-medium">{row.original.entityId}</div>
            <div className="text-xs text-muted-foreground">{entityTypeLabel(row.original.entityType)}</div>
          </div>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Business Impact",
        enableSorting: false,
        cell: ({ getValue }) => {
          const text = getValue() ?? "—";
          return (
            <Tooltip>
              <TooltipTrigger render={<p className="line-clamp-2 max-w-xs text-left text-sm text-muted-foreground" />}>
                {text}
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">{text}</TooltipContent>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor("detectedAt", {
        header: "Detected",
        cell: ({ getValue }) => (
          <Tooltip>
            <TooltipTrigger render={<span className="whitespace-nowrap text-sm text-muted-foreground" />}>
              {formatRelativeTime(getValue())}
            </TooltipTrigger>
            <TooltipContent>{formatDateTime(getValue())}</TooltipContent>
          </Tooltip>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: () => <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: exceptions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-[1] bg-muted/60 backdrop-blur">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 font-medium hover:text-foreground"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : sortDir === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              tabIndex={0}
              role="link"
              aria-label={`View exception ${row.original.exceptionId}`}
              onClick={() => router.push(`/wms/exceptions/${row.original.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/wms/exceptions/${row.original.id}`);
              }}
              className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
