import { usePortfolios } from "@aegis/sdk-portfolios";
import { cn } from "@aegis/platform-ui";

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * The Portfolio Snapshot Function — reads portfolios through the SDK hook and
 * renders them. It imports no other Function and touches no HTTP directly.
 */
export function PortfolioSnapshot() {
  const { data, isLoading, isError, error } = usePortfolios();

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio Snapshot</h1>
        <p className="text-sm text-muted-foreground">
          Mocked portfolios served through @aegis/sdk-portfolios.
        </p>
      </header>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading portfolios…</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load portfolios: {String(error)}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {data?.map((p) => (
          <li
            key={p.id}
            className={cn(
              "rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-medium">{p.label}</h2>
              <span className="text-xs text-muted-foreground">{p.id}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.strategy}</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-lg font-semibold">
                {formatMoney(p.marketValue.amount, p.marketValue.currency)}
              </span>
              <span className="text-xs text-muted-foreground">
                {p.holdingsCount} holdings
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
