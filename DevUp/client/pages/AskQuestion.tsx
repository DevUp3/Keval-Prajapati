import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { addQuestion } = useApp();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
      setErrors({ ...errors, tags: "" });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.replace(/<[^>]*>/g, "").length < 30) {
      newErrors.description = "Description must be at least 30 characters long";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    } else if (tags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addQuestion({
        title: title.trim(),
        description: description.trim(),
        tags,
        author: user?.username || "Anonymous",
        authorId: user?.id || "unknown",
      });

      toast({
        title: "Question posted!",
        description: "Your question has been posted successfully.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    const draft = {
      title,
      description,
      tags,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("stackit_question_draft", JSON.stringify(draft));
    toast({
      title: "Draft saved",
      description: "Your question has been saved as a draft.",
    });
  };

  const loadDraft = () => {
    const saved = localStorage.getItem("stackit_question_draft");
    if (saved) {
      const draft = JSON.parse(saved);
      setTitle(draft.title || "");
      setDescription(draft.description || "");
      setTags(draft.tags || []);
      toast({
        title: "Draft loaded",
        description: "Your saved draft has been loaded.",
      });
    }
  };

  useEffect(() => {
    // Load draft on component mount
    const saved = localStorage.getItem("stackit_question_draft");
    if (saved) {
      const draft = JSON.parse(saved);
      if (draft.title || draft.description || draft.tags?.length > 0) {
        // Only show load option if there's actual content
        const shouldLoad = window.confirm(
          "You have a saved draft. Would you like to load it?",
        );
        if (shouldLoad) {
          loadDraft();
        }
      }
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Ask a Question
        </h1>
        <p className="text-muted-foreground">
          Get help from the community by asking a detailed question.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Share your question with the community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                placeholder="Be specific and imagine you're asking a question to another person"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
              <p className="text-sm text-muted-foreground">
                A good title summarizes your problem in one sentence.
              </p>
            </div>

            {/* Rich Text Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  if (errors.description) {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                placeholder="Provide all the details. Include what you tried and what you expected vs. what actually happened. Use the toolbar to format your text, add links, images, and more!"
                minHeight="300px"
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Rich Text Features Available:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>Text Formatting:</strong> Bold, italic, underline,
                    strikethrough
                  </li>
                  <li>
                    <strong>Lists:</strong> Numbered lists and bullet points
                  </li>
                  <li>
                    <strong>Alignment:</strong> Left, center, right text
                    alignment
                  </li>
                  <li>
                    <strong>Links:</strong> Insert hyperlinks to external URLs
                  </li>
                  <li>
                    <strong>Images:</strong> Upload and insert images directly
                  </li>
                  <li>
                    <strong>Emojis:</strong> Insert emojis to express yourself
                    😊
                  </li>
                </ul>
                <p className="mt-2">
                  <strong>Keyboard Shortcuts:</strong> Ctrl+B (Bold), Ctrl+I
                  (Italic), Ctrl+U (Underline)
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-2">
                <div
                  className={`flex flex-wrap gap-2 min-h-[50px] p-3 border rounded-md ${
                    errors.tags ? "border-destructive" : ""
                  }`}
                >
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {tags.length < 5 && (
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={tags.length === 0 ? "Add tags..." : ""}
                      className="border-0 shadow-none p-0 h-8 flex-1 min-w-[100px] focus-visible:ring-0"
                    />
                  )}
                </div>
                {errors.tags && (
                  <p className="text-sm text-destructive">{errors.tags}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Add up to 5 tags to describe what your question is about.
                  Press Enter or comma to add a tag.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Question
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Rich Text Editor Features Demo Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Rich Text Editor Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Text Formatting</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Bold</strong> text for emphasis
                </li>
                <li>
                  • <em>Italic</em> text for subtle emphasis
                </li>
                <li>
                  • <u>Underline</u> for highlighting
                </li>
                <li>
                  • <s>Strikethrough</s> for corrections
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Lists & Structure</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Bullet point lists</li>
                <li>• Numbered lists (1, 2, 3...)</li>
                <li>• Left, center, right alignment</li>
                <li>• Organized content structure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Media & Links</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Hyperlink insertion with custom text</li>
                <li>• Image upload and embedding</li>
                <li>• Automatic image resizing</li>
                <li>• External link handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Interactive Elements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Emoji picker with 100+ emojis 😀</li>
                <li>• Keyboard shortcuts support</li>
                <li>• Real-time preview</li>
                <li>• Content validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Tips for asking a good question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Search to see if your question has been asked before</li>
            <li>• Be specific and clear in your title</li>
            <li>• Provide context and what you've tried</li>
            <li>• Include relevant code and error messages</li>
            <li>• Use the rich text editor to format your content properly</li>
            <li>• Add images or links to provide more context</li>
            <li>• Use emojis sparingly to enhance readability</li>
            <li>• Add relevant tags to help others find your question</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
