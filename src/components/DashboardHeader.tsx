import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import phedLogo from "@/assets/phed-logo.png";
export function DashboardHeader() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 gap-4">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>

      <div className="flex items-center gap-2">
        <img src={phedLogo} alt="PHED" className="h-8 w-auto" />
        <span className="text-xl font-semibold text-primary">PHED-CRM</span>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="[Click here for filter options]"
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />

        <div className="flex items-center gap-2 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  {auth.user?.Photo ||
                  auth.user?.avatar ||
                  auth.user?.picture ? (
                    <AvatarImage
                      src={
                        auth.user?.Photo ||
                        auth.user?.avatar ||
                        auth.user?.picture
                      }
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {(auth.user?.StaffName || auth.user?.name || "U")[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">
                  {auth.user?.StaffName || auth.user?.name || "User"}
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
    </header>
  );
}
