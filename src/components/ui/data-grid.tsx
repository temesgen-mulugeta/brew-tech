import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataGridItem = {
  label: string;
  data: React.ReactNode | string;
  title?: string;
};

type DataGridProps = {
  items: DataGridItem[];
  className?: string;
  title?: string;
};

export function DataGrid({ items, className, title }: DataGridProps) {
  return (
    <div className="rounded-lg border h-min">
      <Table className={cn(className)}>
        <TableBody>
          {title && (
            <TableRow>
              <TableHead
                className="text-primary border-b font-semibold"
                colSpan={2}
              >
                {title}
              </TableHead>
            </TableRow>
          )}
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-1/3 text-muted-foreground align-top">
                {item.label}
              </TableCell>
              <TableCell>{item.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
