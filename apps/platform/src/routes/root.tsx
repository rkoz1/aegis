import { Link, Outlet } from "@tanstack/react-router";
import { Home, Workflow, Component } from "lucide-react";
import { useSession } from "@aegis/platform-session";
import { groupByStage } from "@aegis/platform-lifecycle";
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  ThemeToggle,
} from "@aegis/platform-ui";

import { registry } from "../registry";
import { PersonaSwitcher } from "../persona-switcher";
import { GlobalSearch } from "../global-search";
import { ContextChip } from "../context-chip";
import { WorkspaceBar } from "../workspace-bar";
import { ActionsInbox } from "../actions-inbox";
import { useRestoreFromUrl } from "../use-restore";

const activeLink = {
  className: "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The host shell chrome: collapsible Sidebar (brand + persona + lifecycle nav +
 *  workspaces) and an inset top bar with global search, context, actions, theme. */
export function RootLayout() {
  useRestoreFromUrl();
  const user = useSession((s) => s.user);
  const activePersona = useSession((s) => s.activePersona);
  const items = registry.visibleTo([activePersona]);
  const stageGroups = groupByStage(items);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-2">
          <div className="flex items-center gap-2 px-1 py-1">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              Æ
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold leading-none">Aegis</p>
              <p className="text-xs text-muted-foreground">Wealth Platform</p>
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <PersonaSwitcher />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link to="/" activeOptions={{ exact: true }} activeProps={activeLink}>
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Lifecycle Map">
                  <Link to="/lifecycle" activeProps={activeLink}>
                    <Workflow />
                    <span>Lifecycle Map</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {stageGroups.map((group) => (
            <SidebarGroup key={group.stage.id}>
              <SidebarGroupLabel>{group.stage.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((m) => (
                  <SidebarMenuItem key={m.id}>
                    <SidebarMenuButton asChild tooltip={m.label}>
                      <Link to={m.route} activeProps={activeLink}>
                        <Component />
                        <span>{m.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <div className="group-data-[collapsible=icon]:hidden">
            <WorkspaceBar />
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              {user.name}
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-2">
            <ContextChip />
            <ActionsInbox />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
