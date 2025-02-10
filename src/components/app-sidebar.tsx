import {
  Cpu,
  Globe,
  HardDrive,
  Home,
  LogOut,
  MemoryStick,
  PackageSearch,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "CPU",
    url: "#",
    icon: Cpu,
  },
  {
    title: "RAM",
    url: "#",
    icon: MemoryStick,
  },
  {
    title: "Red",
    url: "#",
    icon: Globe,
  },
  {
    title: "Procesos",
    url: "#",
    icon: PackageSearch,
  },
  {
    title: "Otros",
    url: "#",
    icon: HardDrive,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center">
            <Avatar>
              <AvatarFallback className="border border-black">
                EL
              </AvatarFallback>
            </Avatar>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Opciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant={"destructive"}>
                <LogOut />
                <span>Cerrar Sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
