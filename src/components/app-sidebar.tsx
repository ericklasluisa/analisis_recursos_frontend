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
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "CPU",
    url: "/dashboard/cpu",
    icon: Cpu,
  },
  {
    title: "RAM",
    url: "/dashboard/ram",
    icon: MemoryStick,
  },
  {
    title: "Red",
    url: "/dashboard/red",
    icon: Globe,
  },
  {
    title: "Procesos",
    url: "/dashboard/procesos",
    icon: PackageSearch,
  },
  {
    title: "Otros",
    url: "/dashboard/otros",
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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
