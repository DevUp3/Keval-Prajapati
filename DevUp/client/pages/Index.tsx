import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Eye,
  Clock,
  TrendingUp,
  Users,
  Plus,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const filterOptions = [
  { label: "Newest", value: "newest", icon: Clock },
  { label: "Active", value: "active", icon: TrendingUp },
  { label: "Most Votes", value: "votes", icon: ArrowUp },
  { label: "Unanswered", value: "unanswered", icon: MessageCircle },
];

export default function Index() {
  const {
    filteredQuestions,
    currentFilter,
    setCurrentFilter,
    updateQuestionVote,
    toggleBookmark,
    searchQuery,
  } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleVote = (questionId: number, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const question = filteredQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const currentVote = question.userVote || 0;
    let newVote = 0;

    if (voteType === "up") {
      newVote = currentVote === 1 ? 0 : 1;
    } else {
      newVote = currentVote === -1 ? 0 : -1;
    }

    updateQuestionVote(questionId, newVote);
  };

  const handleBookmark = (questionId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleBookmark(questionId);
  };

  const sortQuestions = (questions: any[]) => {
    switch (currentFilter) {
      case "votes":
        return [...questions].sort((a, b) => b.votes - a.votes);
      case "active":
        return [...questions].sort((a, b) => {
          // Sort by recent activity (answers, views)
          const aActivity = a.answers + a.views / 10;
          const bActivity = b.answers + b.views / 10;
          return bActivity - aActivity;
        });
      case "unanswered":
        return [...questions].filter((q) => !q.isAnswered);
      case "newest":
      default:
        return [...questions].sort((a, b) => b.id - a.id);
    }
  };

  const sortedQuestions = sortQuestions(filteredQuestions);

  const QuestionCard = ({ question }: { question: any }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-1 min-w-[60px]">
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${
                question.userVote === 1
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => handleVote(question.id, "up")}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span
              className={`font-bold text-lg ${
                question.userVote === 1
                  ? "text-primary"
                  : question.userVote === -1
                    ? "text-destructive"
                    : "text-foreground"
              }`}
            >
              {question.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 ${
                question.userVote === -1
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-destructive"
              }`}
              onClick={() => handleVote(question.id, "down")}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 mt-2"
              onClick={() => handleBookmark(question.id)}
            >
              {question.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary" />
              )}
            </Button>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-lg leading-tight mb-2 hover:text-primary cursor-pointer"
              onClick={() => navigate(`/question/${question.id}`)}
            >
              {question.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {question.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {question.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span
                className={`font-medium ${
                  question.hasAcceptedAnswer
                    ? "text-success"
                    : question.isAnswered
                      ? "text-info"
                      : ""
                }`}
              >
                {question.answers}
              </span>
              {question.hasAcceptedAnswer && (
                <CheckCircle className="h-3 w-3 text-success ml-1" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{question.views}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span>asked {question.timeAgo} by</span>
            <span className="font-medium text-primary">{question.author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "All Questions"}
          </h1>
          <p className="text-muted-foreground">
            {sortedQuestions.length} question
            {sortedQuestions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => navigate("/ask")} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Ask Question
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">892</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-info" />
              <div>
                <p className="text-2xl font-bold">456</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="h-5 w-5 text-warning bg-warning/10 text-warning border-warning/20">
                #
              </Badge>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={currentFilter}
        onValueChange={setCurrentFilter}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          {filterOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="flex items-center space-x-2"
            >
              <option.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {filterOptions.map((option) => (
          <TabsContent key={option.value} value={option.value} className="mt-6">
            <div className="space-y-4">
              {sortedQuestions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery
                        ? "No questions found"
                        : option.value === "unanswered"
                          ? "No unanswered questions"
                          : "No questions yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try adjusting your search terms or browse all questions."
                        : "Be the first to ask a question and start the conversation!"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => navigate("/ask")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Ask the First Question
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                sortedQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Load More Button */}
      {sortedQuestions.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            Load More Questions
          </Button>
        </div>
      )}
    </div>
  );
}
