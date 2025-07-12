import {
  Bell,
  Search,
  User,
  LogIn,
  MessageCircle,
  Plus,
  Moon,
  Sun,
  Hash,
  Users,
  Home,
  Menu,
  CheckCircle,
  Heart,
  AtSign,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    if (location.pathname !== "/") {
      navigate(`/?search=${encodeURIComponent(localSearchQuery)}`);
    }
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    if (notification.questionId) {
      navigate(`/question/${notification.questionId}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "answer":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case "vote":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "accepted":
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "answer":
        return "border-l-blue-500";
      case "comment":
        return "border-l-green-500";
      case "mention":
        return "border-l-purple-500";
      case "vote":
        return "border-l-red-500";
      case "accepted":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatTimeAgo = (createdAt: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h1
              className="text-xl font-bold text-foreground cursor-pointer"
              onClick={() => navigate("/")}
            >
              StackIt
            </h1>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isCurrentPath("/") && "bg-accent/50",
                    )}
                    onClick={() => navigate("/")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Questions
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isCurrentPath("/tags") && "bg-accent/50",
                    )}
                    onClick={() => navigate("/tags")}
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    Tags
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isCurrentPath("/users") && "bg-accent/50",
                    )}
                    onClick={() => navigate("/users")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  Questions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/tags")}>
                  <Hash className="mr-2 h-4 w-4" />
                  Tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/users")}>
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4"
            />
          </form>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-2">
          {/* Ask Question Button */}
          <Button className="hidden sm:flex" onClick={() => navigate("/ask")}>
            <Plus className="mr-2 h-4 w-4" />
            Ask Question
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 px-0"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Enhanced Notifications */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground animate-pulse">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-96 max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-semibold flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </h4>
                  {unreadNotifications > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground font-medium">
                      No notifications yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You'll be notified when someone interacts with your
                      content
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 cursor-pointer hover:bg-accent/50 transition-colors border-l-4",
                          getNotificationColor(notification.type),
                          !notification.isRead && "bg-accent/20",
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  !notification.isRead
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary ml-2 flex-shrink-0" />
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                              {notification.description}
                            </p>

                            {notification.content && (
                              <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mb-1 line-clamp-2">
                                "{notification.content}"
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {notification.createdAt
                                  ? formatTimeAgo(notification.createdAt)
                                  : notification.timeAgo}
                              </p>
                              {notification.fromUser && (
                                <div className="flex items-center space-x-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback className="text-xs">
                                      {notification.fromUser
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">
                                    {notification.fromUser}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {notifications.length > 10 && (
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => navigate("/notifications")}
                    >
                      View all notifications ({notifications.length})
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-questions")}>
                  My Questions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-answers")}>
                  My Answers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
