import { X } from "lucide-react";
import { Badge } from "@aegis/platform-ui";
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
    <Badge variant="secondary" className="gap-1.5 py-1 pr-1.5">
      <span className="text-muted-foreground">Context:</span>
      <span className="font-medium">
        {context.name ?? context.id ?? context.type}
      </span>
      <button
        type="button"
        onClick={clear}
        aria-label="Clear context"
        className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}
