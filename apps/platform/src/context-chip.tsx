import { useContextBus } from "@aegis/platform-context";

/** A live, always-visible reactor to the Context Bus — proves Context emitted by
 *  one Function is observable platform-wide. */
export function ContextChip() {
  const context = useContextBus((s) => s.context);
  const clear = useContextBus((s) => s.clear);

  if (!context) {
    return <span className="text-xs text-muted-foreground">No selection</span>;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
      <span className="text-muted-foreground">Context:</span>
      <span className="font-medium">
        {context.name ?? context.id ?? context.type}
      </span>
      <button
        type="button"
        onClick={clear}
        aria-label="Clear context"
        className="text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}
