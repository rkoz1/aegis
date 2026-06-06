import { usePortfolios } from "@aegis/sdk-portfolios";
import { Badge, Card, cn } from "@aegis/platform-ui";
import { useContextOfType, ContextTypes } from "@aegis/platform-context";

/** A mock mandate check: large books are flagged for review. */
function mandateStatus(holdingsCount: number): { label: string; ok: boolean } {
  return holdingsCount > 100
    ? { label: "Review", ok: false }
    : { label: "Pass", ok: true };
}

/**
 * Compliance Checks Function — reuses the portfolios SDK (Functions compose SDKs,
 * not each other) and surfaces a simulated mandate check per portfolio.
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

      {isLoading && <p className="text-sm text-muted-foreground">Running checks…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load portfolios.</p>}

      <Card className="divide-y divide-border py-0">
        {data?.map((p) => {
          const status = mandateStatus(p.holdingsCount);
          const isSelected = selected?.id === p.id;
          return (
            <div
              key={p.id}
              className={cn(
                "flex items-center justify-between p-4",
                isSelected && "bg-accent/50",
              )}
            >
              <div>
                <p className="font-medium text-card-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground">
                  {p.holdingsCount} holdings · {p.strategy}
                </p>
              </div>
              <Badge variant={status.ok ? "secondary" : "destructive"}>
                {status.label}
              </Badge>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
