import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { registry } from "./registry";
import { RootLayout } from "./routes/root";
import { HomePage } from "./routes/home";
import { Guarded } from "./routes/guarded";
import { LifecycleMap } from "./routes/lifecycle-map";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const lifecycleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lifecycle",
  component: LifecycleMap,
});

/** Routes are generated from the Registry — manifests drive routing (ADR 0001). */
const functionRoutes = registry.all().map((m) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: m.route,
    component: () => <Guarded manifest={m} />,
  }),
);

const routeTree = rootRoute.addChildren([
  indexRoute,
  lifecycleRoute,
  ...functionRoutes,
]);

export const router = createRouter({ routeTree });
