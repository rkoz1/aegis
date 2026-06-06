import { usePortfolios } from "@aegis/sdk-portfolios";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aegis/platform-ui";
import { useContextOfType, ContextTypes } from "@aegis/platform-context";

/** A mock mandate check: large books are flagged for review. */
function mandateStatus(holdingsCount: number): { label: string; ok: boolean } {
  return holdingsCount > 100
    ? { label: "Review", ok: false }
    : { label: "Pass", ok: true };
}

/**
 * Compliance Checks Function — reuses the portfolios SDK (Functions compose SDKs,
 * not each other) and surfaces a simulated mandate check per portfolio as a table.
 */
export function ComplianceChecks() {
  const { data, isLoading, isError } = usePortfolios();
  const selected = useContextOfType(ContextTypes.portfolio);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Compliance Checks</h1>
        <p className="text-sm text-muted-foreground">
          Simulated mandate checks across portfolios.
        </p>
      </header>

      {isError && <p className="text-sm text-destructive">Failed to load portfolios.</p>}

      <div className="overflow-hidden rounded-lg border border-border">
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
            {data?.map((p) => {
              const status = mandateStatus(p.holdingsCount);
              const isSelected = selected?.id === p.id;
              return (
                <TableRow key={p.id} data-state={isSelected ? "selected" : undefined}>
                  <TableCell className="font-medium">{p.label}</TableCell>
                  <TableCell className="text-muted-foreground">{p.strategy}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {p.holdingsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={status.ok ? "secondary" : "destructive"}>
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
