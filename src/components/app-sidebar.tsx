import { Fragment } from "react";
import {
  BookOpen,
  SquareTerminal,
  ChevronsUpDown,
  PiggyBank,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMyProfileQuery } from "@/services/apiService";

const data = {
  user: {
    name: "User",
    email: "name@mail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  app: {
    name: "Donation Platform",
    logo: PiggyBank,
    plan: "Prototype",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Setting",
      url: "#",
      icon: BookOpen,
    },
  ],
  navSecond: [
    {
      title: "Color & Theme",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Donate",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "Mediashare",
      url: "#",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = useGetMyProfileQuery();
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* HEADER: The Logo Section */}
      <SidebarHeader className="border max-h-12">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="md">
              <div className="flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground group-data-[state=collapsed]:size-8">
                <data.app.logo className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data.app.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT: The Menu Items */}
      <SidebarContent className="border">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Fragment key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cutomize</SidebarGroupLabel>
          <SidebarMenu>
            {data.navSecond.map((item) => (
              <Fragment key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER: The User Profile */}
      <SidebarFooter className="border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={data.user.avatar}
                      alt={profile?.username}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {profile?.display_name}
                    </span>
                    <span className="truncate text-xs">{profile?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                {/* User Menu Content */}
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
