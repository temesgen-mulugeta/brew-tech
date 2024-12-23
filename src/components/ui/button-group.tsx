// Dependencies: pnpm install lucide-react

import type { ButtonProps } from "@/components/ui/button";
import { LoadingButton } from "../common/loading-button";

export type ButtonGroupButtonProp = {
  icon?: React.ReactNode;
  label?: string;
  onClick: () => void;
  isLoading?: boolean;
  variant?: ButtonProps["variant"];
};

type ButtonGroupProps = {
  buttons: ButtonGroupButtonProp[];
};

export default function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="inline-flex -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
      {buttons.map((button, index) => (
        <LoadingButton
          key={index}
          className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 "
          variant={button.variant ?? "outline"}
          onClick={button.onClick}
          isLoading={button.isLoading}
        >
          {button.icon && (
            <span className="-ms-1 me-2 opacity-60">{button.icon}</span>
          )}
          {button.label}
        </LoadingButton>
      ))}
    </div>
  );
}
