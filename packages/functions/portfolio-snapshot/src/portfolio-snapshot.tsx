import { usePortfolios } from "@aegis/sdk-portfolios";
import {
  Change,
  Stat,
  StatLabel,
  StatValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@aegis/platform-ui";
import {
  useContextBus,
  useContextOfType,
  makeContext,
  ContextTypes,
} from "@aegis/platform-context";

function money(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const pct = (v: number) => `${v.toFixed(2)}%`;

/**
 * The Portfolio Snapshot Function — a KPI row + a portfolios blotter. Selecting a
 * row emits a portfolio Context; numerics are mono/tabular with P&L colouring.
 */
export function PortfolioSnapshot() {
  const { data, isLoading, isError } = usePortfolios();
  const setContext = useContextBus((s) => s.setContext);
  const selected = useContextOfType(ContextTypes.portfolio);

  const portfolios = data ?? [];
  const totalHoldings = portfolios.reduce((s, p) => s + p.holdingsCount, 0);
  const avgChange = portfolios.length
    ? portfolios.reduce((s, p) => s + p.dayChangePct, 0) / portfolios.length
    : 0;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio Snapshot</h1>
        <p className="text-sm text-muted-foreground">
          Select a portfolio to set the shared context.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat>
          <StatLabel>Portfolios</StatLabel>
          <StatValue>{portfolios.length}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Total Holdings</StatLabel>
          <StatValue>{totalHoldings}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Avg Day Change</StatLabel>
          <StatValue>
            <Change value={avgChange} format={pct} />
          </StatValue>
        </Stat>
      </div>

      {isError && (
        <p className="text-sm text-destructive">Failed to load portfolios.</p>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Portfolio</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Holdings</TableHead>
              <TableHead className="text-right">Day</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  Loading portfolios…
                </TableCell>
              </TableRow>
            )}
            {portfolios.map((p) => {
              const isSelected = selected?.id === p.id;
              return (
                <TableRow key={p.id} data-state={isSelected ? "selected" : undefined}>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() =>
                        setContext(
                          makeContext(ContextTypes.portfolio, {
                            id: p.id,
                            name: p.label,
                          }),
                        )
                      }
                      aria-pressed={isSelected}
                      className={cn(
                        "text-left font-medium hover:underline",
                        isSelected && "text-primary",
                      )}
                    >
                      {p.label}
                    </button>
                    <div className="font-mono text-xs text-muted-foreground">{p.id}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.strategy}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {money(p.marketValue.amount, p.marketValue.currency)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {p.holdingsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Change value={p.dayChangePct} format={pct} />
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
