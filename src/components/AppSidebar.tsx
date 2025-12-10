import {
  Home,
  FileText,
  Settings,
  BarChart3,
  ClipboardCheck,
  FileQuestion,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
const menuItems = [
  {
    title: "Dashboards",
    icon: Home,
    url: "/dashboard",
  },

  {
    title: "Complaints/Requests",
    icon: FileText,
    url: "/complaints",
    subItems: [
      {
        title: "New Complaint",
        url: "/new-complaint",
      },
      {
        title: "Pending",
        url: "/complaints/pending",
      },
      {
        title: "Resolved",
        url: "/complaints/resolved",
      },
      {
        title: "Escalated",
        url: "/complaints/escalated",
      },
      {
        title: "All Complaints",
        url: "/complaints/all",
      },
    ],
  },
  {
    title: "Configuration",
    icon: Settings,
    url: "/configuration",
    subItems: [
      {
        title: "User Management",
        url: "/configuration/users",
      },
      {
        title: "Departments",
        url: "/configuration/departments",
      },
      {
        title: "Categories",
        url: "/configuration/categories",
      },
      {
        title: "SLA Settings",
        url: "/configuration/sla",
      },
    ],
  },
  {
    title: "CRM Reports",
    icon: BarChart3,
    url: "/crm-reports",
    subItems: [
      {
        title: "Ticket Summary",
        url: "/crm-reports/tickets",
      },
      {
        title: "Division Reports",
        url: "/crm-reports/divisions",
      },
      {
        title: "Category Analysis",
        url: "/crm-reports/categories",
      },
      {
        title: "Performance Metrics",
        url: "/crm-reports/performance",
      },
      {
        title: "SLA Reports",
        url: "/crm-reports/sla",
      },
    ],
  },
  {
    title: "KYC Reports",
    icon: ClipboardCheck,
    url: "/kyc-reports",
    subItems: [
      {
        title: "Customer Verification",
        url: "/kyc-reports/verification",
      },
      {
        title: "Pending KYC",
        url: "/kyc-reports/pending",
      },
      {
        title: "Approved KYC",
        url: "/kyc-reports/approved",
      },
      {
        title: "Rejected KYC",
        url: "/kyc-reports/rejected",
      },
    ],
  },
];
export function AppSidebar() {
  const { user } = useAuth();
  const { open } = useSidebar();
  const navigate = useNavigate();
  
    const handleLogout = () => {
      user.logout();
      navigate("/");
    };
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent className="bg-[sidebar-accent-foreground] bg-teal-900">
        {/* user area at top */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          {(() => {
            const displayName =
              user?.StaffName || user?.name || user?.Staff || "Guest User";
            const email = user?.Email || user?.email || "no-email@local";
            const staffId =
              user?.StaffId || user?.StaffID || user?.StaffId || "";
            const role = user?.Role || user?.role || "";
            return (
              <>
                <div>
                  <Avatar>
                    {user?.Photo || user?.avatar || user?.picture ? (
                      <AvatarImage
                        src={user?.Photo || user?.avatar || user?.picture}
                      />
                    ) : (
                      <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-primary-foreground">
                    {displayName}
                  </span>
                {/* goz */}
                  <div className="flex items-center gap-2 ml-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Avatar className="h-8 w-8">
                            {user.user?.Photo ||
                            user.user?.avatar ||
                            user.user?.picture ? (
                              <AvatarImage
                                src={
                                  user.user?.Photo ||
                                  user.user?.avatar ||
                                  user.user?.picture
                                }
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {(user.user?.StaffName || user.user?.name || "U")[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user.user?.StaffName || user.user?.name || "User"}
                          </span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => navigate("/profile")}>
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleLogout}>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="text-primary-foreground hover:bg-primary-foreground/10 data-[state=open]:bg-primary-foreground/10">
                          <item.icon className="h-4 w-4" />
                          {open && <span>{item.title}</span>}
                          {open && (
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={subItem.url}
                                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                  activeClassName="bg-primary-foreground/20 text-primary-foreground font-medium"
                                >
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="text-primary-foreground hover:bg-primary-foreground/10"
                        activeClassName="bg-primary-foreground/20 text-primary-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
