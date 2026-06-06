import { useState, type ReactNode, type KeyboardEvent } from "react";
import { usePortfolios, type Portfolio } from "@aegis/sdk-portfolios";
import {
  Badge,
  Change,
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

function money(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const pct = (v: number) => `${v.toFixed(2)}%`;

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

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border py-1.5 last:border-b-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-xs tabular-nums">{children}</span>
    </div>
  );
}

/** Right-rail inspector for the selected portfolio (page-owned right region). */
function Inspector({ portfolio }: { portfolio: Portfolio }) {
  return (
    <aside className="w-full shrink-0 border border-border bg-card lg:w-80">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-medium text-primary">{portfolio.label}</h2>
        <p className="font-mono text-[10px] text-muted-foreground">{portfolio.id}</p>
      </div>
      <div className="px-4 py-2">
        <MetaRow label="Market Value">
          {money(portfolio.marketValue.amount, portfolio.marketValue.currency)}
        </MetaRow>
        <MetaRow label="Day Change">
          <Change value={portfolio.dayChangePct} format={pct} />
        </MetaRow>
        <MetaRow label="Holdings">{portfolio.holdingsCount}</MetaRow>
        <MetaRow label="Strategy">
          <span className="font-sans">{portfolio.strategy}</span>
        </MetaRow>
        <MetaRow label="Account">{portfolio.accountId}</MetaRow>
        <MetaRow label="Base Ccy">{portfolio.baseCurrency}</MetaRow>
      </div>
    </aside>
  );
}

/**
 * Portfolio Snapshot — a positions blotter (KPI context bar + dense table) with a
 * right-rail inspector for the selected portfolio. Selecting a row emits Context.
 */
export function PortfolioSnapshot() {
  const { data, isLoading, isError } = usePortfolios();
  const setContext = useContextBus((s) => s.setContext);
  const selected = useContextOfType(ContextTypes.portfolio);

  const portfolios = data ?? [];
  const selectedPortfolio = portfolios.find((p) => p.id === selected?.id);
  const [cursor, setCursor] = useState(-1);

  function select(p: Portfolio) {
    setContext(makeContext(ContextTypes.portfolio, { id: p.id, name: p.label }));
  }

  function onTableKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const from =
      cursor < 0
        ? portfolios.findIndex((p) => p.id === selected?.id)
        : cursor;
    const next =
      e.key === "ArrowDown"
        ? Math.min(from + 1, portfolios.length - 1)
        : Math.max(from <= 0 ? 0 : from - 1, 0);
    const p = portfolios[next];
    if (p) {
      setCursor(next);
      select(p);
    }
  }
  const totalAum = portfolios.reduce((s, p) => s + p.marketValue.amount, 0);
  const totalHoldings = portfolios.reduce((s, p) => s + p.holdingsCount, 0);
  const avgChange = portfolios.length
    ? portfolios.reduce((s, p) => s + p.dayChangePct, 0) / portfolios.length
    : 0;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Portfolio Snapshot</h1>
        <p className="text-xs text-muted-foreground">
          Select a portfolio to set the shared context.
        </p>
      </header>

      <div className="flex flex-wrap border border-border bg-card">
        <Kpi label="Net Asset Value">{money(totalAum)}</Kpi>
        <Kpi label="Portfolios">{portfolios.length}</Kpi>
        <Kpi label="Holdings">{totalHoldings}</Kpi>
        <Kpi label="Avg Day">
          <Change value={avgChange} format={pct} />
        </Kpi>
      </div>

      {isError && <p className="text-xs text-loss">Failed to load portfolios.</p>}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          className="min-w-0 flex-1 border border-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          tabIndex={0}
          role="grid"
          aria-label="Portfolios"
          onKeyDown={onTableKeyDown}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portfolio</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Holdings</TableHead>
                <TableHead className="text-right">Day</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Loading portfolios…
                  </TableCell>
                </TableRow>
              )}
              {portfolios.map((p) => {
                const isSelected = selected?.id === p.id;
                return (
                  <TableRow
                    key={p.id}
                    data-state={isSelected ? "selected" : undefined}
                    onClick={() => select(p)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => select(p)}
                        aria-pressed={isSelected}
                        className={cn("text-left font-medium text-primary hover:underline")}
                      >
                        {p.label}
                      </button>
                      <div className="font-mono text-[10px] text-muted-foreground">{p.id}</div>
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
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-[10px] font-bold uppercase text-primary"
                      >
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {selectedPortfolio && <Inspector portfolio={selectedPortfolio} />}
      </div>
    </section>
  );
}
