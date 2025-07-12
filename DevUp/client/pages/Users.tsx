import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Users as UsersIcon,
  TrendingUp,
  Clock,
  Award,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  {
    id: "1",
    username: "john_doe",
    reputation: 1234,
    questionsCount: 23,
    answersCount: 45,
    acceptedAnswers: 12,
    location: "San Francisco, CA",
    joinDate: "2023-01-15",
    bio: "Full-stack developer passionate about React and Node.js",
    tags: ["React", "JavaScript", "Node.js"],
  },
  {
    id: "6",
    username: "security_expert",
    reputation: 5678,
    questionsCount: 8,
    answersCount: 89,
    acceptedAnswers: 34,
    location: "London, UK",
    joinDate: "2022-06-10",
    bio: "Cybersecurity specialist with expertise in web authentication",
    tags: ["Security", "Authentication", "JWT"],
  },
  {
    id: "7",
    username: "react_guru",
    reputation: 3456,
    questionsCount: 15,
    answersCount: 67,
    acceptedAnswers: 28,
    location: "Toronto, Canada",
    joinDate: "2022-11-20",
    bio: "React expert helping developers build better UIs",
    tags: ["React", "TypeScript", "CSS"],
  },
  {
    id: "8",
    username: "curious_dev",
    reputation: 789,
    questionsCount: 12,
    answersCount: 18,
    acceptedAnswers: 5,
    location: "Berlin, Germany",
    joinDate: "2023-05-12",
    bio: "Junior developer always eager to learn new technologies",
    tags: ["JavaScript", "Learning", "Beginner"],
  },
  {
    id: "9",
    username: "backend_ninja",
    reputation: 2345,
    questionsCount: 19,
    answersCount: 52,
    acceptedAnswers: 21,
    location: "Tokyo, Japan",
    joinDate: "2022-12-08",
    bio: "Backend developer specializing in scalable systems",
    tags: ["Node.js", "Database", "API"],
  },
  {
    id: "10",
    username: "frontend_artist",
    reputation: 1876,
    questionsCount: 27,
    answersCount: 41,
    acceptedAnswers: 16,
    location: "New York, NY",
    joinDate: "2023-02-28",
    bio: "UI/UX developer creating beautiful web experiences",
    tags: ["CSS", "Design", "React"],
  },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("reputation");
  const navigate = useNavigate();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (currentFilter) {
      case "reputation":
        return b.reputation - a.reputation;
      case "newest":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case "name":
        return a.username.localeCompare(b.username);
      default:
        return b.reputation - a.reputation;
    }
  });

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const filterOptions = [
    { label: "Reputation", value: "reputation", icon: TrendingUp },
    { label: "Newest", value: "newest", icon: Clock },
    { label: "Name", value: "name", icon: UsersIcon },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Users</h1>
        <p className="text-muted-foreground">
          Discover and connect with the StackIt community. Find experts in your
          field and see who's contributing the most valuable content.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-info" />
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers
                    .reduce((sum, user) => sum + user.questionsCount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Questions Asked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers
                    .reduce((sum, user) => sum + user.answersCount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Answers Given</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {mockUsers
                    .reduce((sum, user) => sum + user.reputation, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Reputation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs
        value={currentFilter}
        onValueChange={setCurrentFilter}
        className="mb-6"
      >
        <TabsList>
          {filterOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="flex items-center space-x-2"
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {filterOptions.map((option) => (
          <TabsContent key={option.value} value={option.value} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedUsers.map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {user.username}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Award className="h-3 w-3" />
                          <span>{user.reputation.toLocaleString()}</span>
                        </div>
                        {user.location && (
                          <p className="text-sm text-muted-foreground truncate">
                            {user.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {user.bio}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <p className="font-semibold text-sm">
                          {user.questionsCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Questions
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {user.answersCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Answers</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-success">
                          {user.acceptedAnswers}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accepted
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {user.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {user.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Member since {formatDate(user.joinDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* No results */}
      {sortedUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms to find the users you're looking
              for.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
