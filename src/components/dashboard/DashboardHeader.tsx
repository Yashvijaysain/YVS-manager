import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, LogOut, Settings, User } from 'lucide-react';
interface DashboardHeaderProps {
  userRole: string;
  userName: string;
}
const DashboardHeader = ({
  userRole,
  userName
}: DashboardHeaderProps) => {
  const {
    signOut
  } = useAuth();
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-destructive';
      case 'teacher':
        return 'text-accent';
      case 'student':
        return 'text-info';
      case 'parent':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  return <header className="bg-card/95 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center p-1">
              <img src="/yvsimg/yvs.png" alt="YVS Logo" className="w-full h-full object-contain" />
              
            </div>
            <div>
              <h1 className="text-xl font-bold">YVS MANAGER</h1>
              <p className="text-sm text-muted-foreground capitalize">
                {userRole} Dashboard
              </p>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${getRoleColor(userRole)} bg-primary/10`}>
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName}</p>
                  <p className={`text-xs capitalize ${getRoleColor(userRole)}`}>
                    {userRole}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};
export default DashboardHeader;