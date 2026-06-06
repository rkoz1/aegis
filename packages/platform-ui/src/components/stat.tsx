import * as React from "react";

import { cn } from "../lib/utils";

/** A KPI stat block — label + monospace tabular value, the way desks show metrics. */
function Stat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat"
      className={cn("rounded-lg border border-border bg-card p-4", className)}
      {...props}
    />
  );
}

function StatLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function StatValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-1 font-mono text-2xl font-semibold tabular-nums", className)}
      {...props}
    />
  );
}

/** A signed, color-coded numeric value (gain green / loss red) — for P&L, deltas. */
function Change({
  value,
  format,
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const sign = value > 0 ? "+" : "";
  return (
    <span
      className={cn(
        "font-mono tabular-nums",
        dir === "up" && "text-gain",
        dir === "down" && "text-loss",
        dir === "flat" && "text-muted-foreground",
        className,
      )}
    >
      {sign}
      {format ? format(value) : value}
    </span>
  );
}

export { Stat, StatLabel, StatValue, Change };
