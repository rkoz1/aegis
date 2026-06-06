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
import { PowerNav } from "../power-nav";
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
      <PowerNav />
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-2">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="font-mono text-lg font-bold uppercase tracking-widest text-primary group-data-[collapsible=icon]:hidden">
              Aegis
            </span>
            <span className="hidden font-mono text-lg font-bold text-primary group-data-[collapsible=icon]:inline">
              Æ
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
              Terminal
            </span>
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

      <SidebarInset className="min-w-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
          <SidebarTrigger className="shrink-0" />
          <GlobalSearch />
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <div className="hidden sm:block">
              <ContextChip />
            </div>
            <ActionsInbox />
            <ThemeToggle />
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
