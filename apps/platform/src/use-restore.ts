import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { fromSearchParams } from "@aegis/platform-workspace";
import { useSession, ROLES, type Role } from "@aegis/platform-session";
import { useContextBus } from "@aegis/platform-context";

/** On first load, restore persona + Context + route from a shared link's URL. */
export function useRestoreFromUrl() {
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const state = fromSearchParams(window.location.search);
    if (!state) return;

    if ((ROLES as readonly string[]).includes(state.persona)) {
      useSession.getState().setActivePersona(state.persona as Role);
    }
    useContextBus.getState().setContext(state.context);
    if (state.route && state.route !== window.location.pathname) {
      navigate({ to: state.route });
    }
  }, [navigate]);
}
