"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon, MoreHorizontal } from "lucide-react";
import React from "react";
import useIsCommandAuthorized from "@/hooks/use-is-authorized";

export type RowActionMenuItem<TData> = {
  label?: (row: Row<TData>) => string;
  icon?: LucideIcon | ((row: Row<TData>) => LucideIcon);
  onClick: (row: Row<TData>) => void;
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
  iconStyle?: React.CSSProperties;
  actionFilterCommand?: string;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: RowActionMenuItem<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const authorizedActions = actions.map((action) => ({
    action,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isAuthorized: useIsCommandAuthorized(action.actionFilterCommand),
  }));

  const visibleActions = authorizedActions.filter(
    ({ action, isAuthorized }) =>
      !action.hidden?.(row.original) &&
      (!action.actionFilterCommand || isAuthorized.data)
  );

  // If no actions are available, don't render the menu
  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {visibleActions.map(({ action }, index) => (
          <DropdownMenuItem
            key={index}
            disabled={action.disabled?.(row.original)}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            className="px-3 py-2"
          >
            {action.icon &&
              React.createElement(
                (typeof action.icon === "function"
                  ? action.icon(row)
                  : action.icon) as LucideIcon,
                {
                  className: "w-3 h-3 mr-2 hover:color",
                  style: action.iconStyle,
                }
              )}
            {action?.label?.(row)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
