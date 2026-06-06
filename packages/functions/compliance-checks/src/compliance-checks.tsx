import type { ReactNode } from "react";
import { usePortfolios } from "@aegis/sdk-portfolios";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@aegis/platform-ui";
import { useContextOfType, ContextTypes } from "@aegis/platform-context";

/** A mock mandate check: large books are flagged for review. */
function mandateStatus(holdingsCount: number): { label: string; ok: boolean } {
  return holdingsCount > 100
    ? { label: "Review", ok: false }
    : { label: "Pass", ok: true };
}

function Kpi({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col justify-center gap-0.5 border-r border-border px-4 py-2 last:border-r-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-base font-semibold tabular-nums">{children}</span>
    </div>
  );
}

/**
 * Compliance Checks — reuses the portfolios SDK and surfaces a simulated mandate
 * check per portfolio: a KPI bar + a dense status table.
 */
export function ComplianceChecks() {
  const { data, isLoading, isError } = usePortfolios();
  const selected = useContextOfType(ContextTypes.portfolio);

  const portfolios = data ?? [];
  const flagged = portfolios.filter((p) => !mandateStatus(p.holdingsCount).ok).length;
  const passing = portfolios.length - flagged;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Compliance Checks</h1>
        <p className="text-xs text-muted-foreground">
          Simulated mandate checks across portfolios.
        </p>
      </header>

      <div className="flex flex-wrap border border-border bg-card">
        <Kpi label="Checked">{portfolios.length}</Kpi>
        <Kpi label="Passing">
          <span className="text-gain">{passing}</span>
        </Kpi>
        <Kpi label="Flagged">
          <span className={flagged ? "text-loss" : undefined}>{flagged}</span>
        </Kpi>
      </div>

      {isError && <p className="text-xs text-loss">Failed to load portfolios.</p>}

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Portfolio</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead className="text-right">Holdings</TableHead>
              <TableHead className="text-right">Mandate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Running checks…
                </TableCell>
              </TableRow>
            )}
            {portfolios.map((p) => {
              const status = mandateStatus(p.holdingsCount);
              const isSelected = selected?.id === p.id;
              return (
                <TableRow
                  key={p.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={cn(!status.ok && "bg-loss/5")}
                >
                  <TableCell className="font-medium">{p.label}</TableCell>
                  <TableCell className="text-muted-foreground">{p.strategy}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {p.holdingsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        status.ok
                          ? "border-gain/50 text-gain"
                          : "border-loss/50 text-loss",
                      )}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
