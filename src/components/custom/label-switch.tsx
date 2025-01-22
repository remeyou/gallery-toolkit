import { CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import { Label } from "~components/ui/label";
import { Switch } from "~components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~components/ui/tooltip";
import { Muted } from "./typography";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  help?: ReactNode;
};

export default function LabelSwitch({
  value,
  onChange,
  label,
  disabled,
  help,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <Label className="flex items-center gap-1 text-base" htmlFor={label}>
        {label}
        {help && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Muted>
                  <CircleHelp className="h-5 w-5" />
                </Muted>
              </TooltipTrigger>
              <TooltipContent>{help}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      <Switch
        id={label}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
