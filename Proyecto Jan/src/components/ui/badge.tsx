import { AlertSeverity } from "@/types";
import { cn } from "@/lib/utils";

const severityStyles: Record<AlertSeverity, string> = {
  Alta: "bg-red-100 text-red-700 border-red-200",
  Media: "bg-amber-100 text-amber-700 border-amber-200",
  Baja: "bg-blue-100 text-blue-700 border-blue-200",
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        severityStyles[severity],
      )}
    >
      {severity}
    </span>
  );
}
