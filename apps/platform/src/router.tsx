import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { registry } from "./registry";
import { RootLayout } from "./routes/root";
import { HomePage } from "./routes/home";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

/** Routes are generated from the Registry — manifests drive routing (ADR 0001). */
const functionRoutes = registry.all().map((m) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: m.route,
    component: m.mount,
  }),
);

const routeTree = rootRoute.addChildren([indexRoute, ...functionRoutes]);

export const router = createRouter({ routeTree });
