import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Hash, TrendingUp, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockTags = [
  {
    name: "React",
    count: 1234,
    description: "A JavaScript library for building user interfaces",
  },
  {
    name: "JavaScript",
    count: 2345,
    description: "High-level programming language for web development",
  },
  {
    name: "TypeScript",
    count: 987,
    description: "Typed superset of JavaScript",
  },
  {
    name: "Node.js",
    count: 876,
    description: "JavaScript runtime environment",
  },
  {
    name: "Express",
    count: 654,
    description: "Web application framework for Node.js",
  },
  { name: "MongoDB", count: 543, description: "NoSQL document database" },
  {
    name: "Authentication",
    count: 432,
    description: "User identity verification",
  },
  {
    name: "JWT",
    count: 321,
    description: "JSON Web Tokens for secure authentication",
  },
  {
    name: "Hooks",
    count: 234,
    description: "React feature for using state in functional components",
  },
  {
    name: "State Management",
    count: 198,
    description: "Managing application state in frontend apps",
  },
  {
    name: "CSS",
    count: 567,
    description: "Cascading Style Sheets for styling web pages",
  },
  { name: "HTML", count: 445, description: "HyperText Markup Language" },
  { name: "API", count: 389, description: "Application Programming Interface" },
  {
    name: "Database",
    count: 298,
    description: "Structured data storage systems",
  },
  {
    name: "Performance",
    count: 267,
    description: "Optimizing application speed and efficiency",
  },
];

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("popular");
  const navigate = useNavigate();

  const filteredTags = mockTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    switch (currentFilter) {
      case "name":
        return a.name.localeCompare(b.name);
      case "new":
        return Math.random() - 0.5; // Mock random sort for "new"
      case "popular":
      default:
        return b.count - a.count;
    }
  });

  const handleTagClick = (tagName: string) => {
    navigate(`/?search=${encodeURIComponent(tagName)}`);
  };

  const filterOptions = [
    { label: "Popular", value: "popular", icon: TrendingUp },
    { label: "Name", value: "name", icon: Hash },
    { label: "New", value: "new", icon: Clock },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tags</h1>
        <p className="text-muted-foreground">
          A tag is a keyword or label that categorizes your question with other,
          similar questions. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockTags.length}</p>
                <p className="text-sm text-muted-foreground">Total Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {mockTags
                    .reduce((sum, tag) => sum + tag.count, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-info" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">New This Week</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedTags.map((tag) => (
                <Card
                  key={tag.name}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTagClick(tag.name)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-sm font-semibold"
                      >
                        {tag.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {tag.count.toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tag.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* No results */}
      {sortedTags.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tags found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms to find the tags you're looking
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
