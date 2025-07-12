import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Eye,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share,
  Flag,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  AtSign,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MentionInput from "@/components/MentionInput";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const {
    getQuestionById,
    getAnswersByQuestionId,
    getCommentsByParent,
    addComment,
    addAnswer,
    updateCommentVote,
    updateQuestionVote,
    updateAnswerVote,
    toggleBookmark,
    acceptAnswer,
  } = useApp();

  const questionId = Number(id);
  const question = getQuestionById(questionId);
  const answers = getAnswersByQuestionId(questionId);

  const [openCommentSections, setOpenCommentSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>(
    {},
  );
  const [answerText, setAnswerText] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The question you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>Back to Questions</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVote = (
    type: "question" | "answer",
    id: number,
    voteType: "up" | "down",
  ) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const currentItem =
      type === "question" ? question : answers.find((a) => a.id === id);
    if (!currentItem) return;

    const currentVote = currentItem.userVote || 0;
    let newVote = 0;

    if (voteType === "up") {
      newVote = currentVote === 1 ? 0 : 1;
    } else {
      newVote = currentVote === -1 ? 0 : -1;
    }

    if (type === "question") {
      updateQuestionVote(id, newVote);
    } else {
      updateAnswerVote(id, newVote);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleBookmark(questionId);
    toast({
      title: question.isBookmarked ? "Bookmark removed" : "Bookmarked",
      description: question.isBookmarked
        ? "Question removed from bookmarks"
        : "Question added to bookmarks",
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: "Question link copied to clipboard",
      });
    });
  };

  const handleFlag = () => {
    toast({
      title: "Content flagged",
      description: "Thank you for reporting. We'll review this content.",
    });
  };

  const handleAcceptAnswer = (answerId: number) => {
    if (!isAuthenticated || user?.username !== question.author) {
      toast({
        title: "Access denied",
        description: "Only the question author can accept answers",
        variant: "destructive",
      });
      return;
    }
    acceptAnswer(answerId);
    toast({
      title: "Answer accepted",
      description: "This answer has been marked as accepted",
    });
  };

  const toggleCommentSection = (key: string) => {
    setOpenCommentSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddComment = (
    parentType: "question" | "answer",
    parentId: number,
  ) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const key = `${parentType}-${parentId}`;
    const commentText = commentTexts[key]?.trim();

    if (!commentText) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    addComment({
      content: commentText,
      author: user?.username || "Anonymous",
      authorId: user?.id || "unknown",
      parentType,
      parentId,
    });

    setCommentTexts((prev) => ({ ...prev, [key]: "" }));
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  const handleSubmitAnswer = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!answerText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your answer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingAnswer(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addAnswer({
        questionId: questionId,
        content: answerText.trim(),
        author: user?.username || "Anonymous",
        authorId: user?.id || "unknown",
        authorReputation: user?.reputation || 1,
        isAccepted: false,
      });

      setAnswerText("");
      toast({
        title: "Answer posted",
        description: "Your answer has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const CommentSection = ({
    parentType,
    parentId,
  }: {
    parentType: "question" | "answer";
    parentId: number;
  }) => {
    const key = `${parentType}-${parentId}`;
    const comments = getCommentsByParent(parentType, parentId);
    const isOpen = openCommentSections[key];

    return (
      <div className="mt-4">
        <Collapsible
          open={isOpen}
          onOpenChange={() => toggleCommentSection(key)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground p-0"
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              {comments.length > 0
                ? `${comments.length} comments`
                : "Add comment"}
              {isOpen ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3">
            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l-2 border-muted pl-4 py-2 hover:border-l-primary/50 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {comment.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">
                          {/* Highlight mentions in comments */}
                          {comment.content.split(/(@\w+)/g).map((part, i) =>
                            part.startsWith("@") ? (
                              <span
                                key={i}
                                className="text-primary font-medium cursor-pointer hover:underline"
                                onClick={() =>
                                  navigate(`/users/${part.substring(1)}`)
                                }
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            ),
                          )}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                if (!isAuthenticated) {
                                  navigate("/login");
                                  return;
                                }
                                const currentVote = comment.userVote || 0;
                                const newVote = currentVote === 1 ? 0 : 1;
                                updateCommentVote(comment.id, newVote);
                              }}
                            >
                              <ArrowUp
                                className={`h-3 w-3 ${
                                  comment.userVote === 1
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            <span className="font-medium">{comment.votes}</span>
                          </div>
                          <span>by {comment.author}</span>
                          <span>{comment.timeAgo}</span>
                          {comment.mentions && comment.mentions.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <AtSign className="h-3 w-3" />
                              <span className="text-xs">
                                mentioned {comment.mentions.join(", ")}
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

            {/* Add Comment Form with Mention Support */}
            {isAuthenticated && (
              <div className="space-y-2">
                <MentionInput
                  value={commentTexts[key] || ""}
                  onChange={(value) =>
                    setCommentTexts((prev) => ({ ...prev, [key]: value }))
                  }
                  placeholder="Add a comment... Use @username to mention someone"
                  className="min-h-[60px]"
                  onMention={(mentions) => {
                    // Handle mentions if needed
                    console.log("Mentioned users:", mentions);
                  }}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Use @username to notify specific users
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleAddComment(parentType, parentId)}
                    disabled={!commentTexts[key]?.trim()}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>{" "}
                to add a comment
              </p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const AnswerCard = ({ answer }: { answer: any }) => (
    <Card className={answer.isAccepted ? "border-success" : ""}>
      <CardContent className="p-6">
        {answer.isAccepted && (
          <div className="flex items-center gap-2 mb-4 text-success">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Accepted Answer</span>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className={
                answer.userVote === 1
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }
              onClick={() => handleVote("answer", answer.id, "up")}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span
              className={`font-medium text-lg ${
                answer.userVote === 1
                  ? "text-primary"
                  : answer.userVote === -1
                    ? "text-destructive"
                    : "text-foreground"
              }`}
            >
              {answer.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={
                answer.userVote === -1
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-destructive"
              }
              onClick={() => handleVote("answer", answer.id, "down")}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            {!answer.isAccepted &&
              isAuthenticated &&
              user?.username === question.author && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAcceptAnswer(answer.id)}
                  className="mt-2 text-success border-success hover:bg-success hover:text-success-foreground"
                  title="Accept this answer"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
          </div>
          <div className="flex-1">
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{
                __html: answer.content.replace(/\n/g, "<br>"),
              }}
            />
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share className="mr-1 h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" onClick={handleFlag}>
                  <Flag className="mr-1 h-4 w-4" />
                  Flag
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  answered {answer.timeAgo} by
                </span>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {answer.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-primary">
                    {answer.author}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {answer.authorReputation.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <CommentSection parentType="answer" parentId={answer.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {question.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <span>Asked {question.timeAgo}</span>
                <span className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views} views</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={question.isBookmarked ? "text-primary" : ""}
              >
                {question.isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className={
                  question.userVote === 1
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }
                onClick={() => handleVote("question", question.id, "up")}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span
                className={`font-medium text-lg ${
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
                className={
                  question.userVote === -1
                    ? "text-destructive bg-destructive/10"
                    : "text-muted-foreground hover:text-destructive"
                }
                onClick={() => handleVote("question", question.id, "down")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div
                className="prose prose-sm max-w-none text-foreground mb-4"
                dangerouslySetInnerHTML={{
                  __html: question.description.replace(/\n/g, "<br>"),
                }}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleFlag}>
                    <Flag className="mr-1 h-4 w-4" />
                    Flag
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    asked by
                  </span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {question.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-primary">
                      {question.author}
                    </span>
                    <span className="text-sm text-muted-foreground">1234</span>
                  </div>
                </div>
              </div>
              <CommentSection parentType="question" parentId={question.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{answers.length} Answers</h2>
        <div className="space-y-4">
          {answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      </div>

      {/* Answer Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Your Answer</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <MentionInput
            value={answerText}
            onChange={setAnswerText}
            placeholder="Write your answer here... Use @username to mention someone"
            minHeight="150px"
            disabled={isSubmittingAnswer}
          />
          <p className="text-sm text-muted-foreground">
            💡 Tip: Use @username to notify specific users about your answer
          </p>
          {isAuthenticated ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={isSubmittingAnswer || !answerText.trim()}
            >
              {isSubmittingAnswer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Your Answer"
              )}
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                You need to be logged in to post an answer
              </p>
              <Button onClick={() => navigate("/login")}>
                Login to Answer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
