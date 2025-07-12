import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  onMention?: (mentionedUsers: string[]) => void;
}

interface User {
  id: string;
  username: string;
  reputation: number;
}

// Mock users for mentions
const mockUsers: User[] = [
  { id: "1", username: "john_doe", reputation: 1234 },
  { id: "6", username: "security_expert", reputation: 5678 },
  { id: "7", username: "react_guru", reputation: 3456 },
  { id: "8", username: "curious_dev", reputation: 789 },
  { id: "9", username: "backend_ninja", reputation: 2345 },
  { id: "10", username: "frontend_artist", reputation: 1876 },
  { id: "11", username: "typescript_dev", reputation: 987 },
  { id: "12", username: "performance_guru", reputation: 654 },
];

export default function MentionInput({
  value,
  onChange,
  placeholder = "Type your message...",
  className = "",
  minHeight = "100px",
  onMention,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [mentionStart, setMentionStart] = useState(-1);
  const [currentQuery, setCurrentQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    onChange(newValue);

    // Check for @ symbol
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex >= 0) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Check if we're in the middle of a mention (no spaces after @)
      if (!textAfterAt.includes(" ") && textAfterAt.length <= 20) {
        setMentionStart(lastAtIndex);
        setCurrentQuery(textAfterAt);

        // Filter users based on query
        const filteredUsers = mockUsers.filter((user) =>
          user.username.toLowerCase().includes(textAfterAt.toLowerCase()),
        );

        setSuggestions(filteredUsers.slice(0, 5));
        setShowSuggestions(filteredUsers.length > 0 && textAfterAt.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Extract mentions and notify parent
    if (onMention) {
      const mentions = extractMentions(newValue);
      onMention(mentions);
    }
  };

  const insertMention = (user: User) => {
    if (textareaRef.current && mentionStart >= 0) {
      const beforeMention = value.substring(0, mentionStart);
      const afterMention = value.substring(
        mentionStart + currentQuery.length + 1,
      );
      const newValue = `${beforeMention}@${user.username} ${afterMention}`;

      onChange(newValue);
      setShowSuggestions(false);

      // Focus back to textarea
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = mentionStart + user.username.length + 2;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition,
          );
        }
      }, 0);

      // Notify parent of mention
      if (onMention) {
        const mentions = extractMentions(newValue);
        onMention(mentions);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        // Handle arrow navigation (simplified)
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(suggestions[0]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div className="relative">
      <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
        <PopoverTrigger asChild>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`${placeholder} (Use @username to mention someone)`}
            className={className}
            style={{ minHeight }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground px-2 py-1">
              Mention a user
            </div>
            {suggestions.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start h-auto p-2"
                onClick={() => insertMention(user)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">@{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.reputation} reputation
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
