"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  FileText,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  contextSnippets?: string[];
};

type AskDocumentResponse = {
  success: boolean;
  error?: string;
  answer?: string;
  extractedText?: string;
  model?: string;
  modelLabel?: string;
  sourceWordCount?: number;
  contextSnippets?: string[];
};

interface DocumentCopilotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
}

const starterPrompts = [
  "What are the main takeaways from this document?",
  "Explain this document like I'm a beginner.",
  "What are the important definitions or concepts here?",
  "Create 5 quiz questions from this document.",
];

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function DocumentCopilotDialog({
  open,
  onOpenChange,
  document,
}: DocumentCopilotDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [modelName, setModelName] = useState(
    "Gemini Flash via OpenRouter"
  );
  const [sourceWordCount, setSourceWordCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      setMessages([]);
      setInput("");
      setIsAsking(false);
      setErrorMessage("");
      setExtractedText("");
      setModelName("Gemini Flash via OpenRouter");
      setSourceWordCount(0);
    }
  }, [open]);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setIsAsking(false);
    setErrorMessage("");
    setExtractedText("");
    setModelName("Gemini Flash via OpenRouter");
    setSourceWordCount(0);
  }, [document?.fileUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isAsking]);

  const canAsk = Boolean(
    input.trim() && !isAsking && document?.fileUrl
  );

  const contextStateLabel = useMemo(
    () =>
      extractedText
        ? `${sourceWordCount.toLocaleString()} source words ready`
        : "Document will be loaded on first question",
    [extractedText, sourceWordCount]
  );

  const askQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !document?.fileUrl || isAsking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedQuestion,
    };

    const priorConversation = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);
    setInput("");
    setErrorMessage("");
    setIsAsking(true);

    try {
      const response = await fetch("/api/ask-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3FileUrl: document.fileUrl,
          fileName: document.fileName,
          question: trimmedQuestion,
          extractedText: extractedText || undefined,
          messages: priorConversation,
        }),
      });

      const data =
        (await response.json()) as AskDocumentResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Document copilot request failed."
        );
      }

      if (data.extractedText) {
        setExtractedText(data.extractedText);
      }

      if (data.sourceWordCount) {
        setSourceWordCount(data.sourceWordCount);
      }

      setModelName(
        data.modelLabel || data.model || modelName
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createId(),
          role: "assistant",
          content:
            data.answer ||
            "I couldn't generate an answer for that question.",
          contextSnippets: data.contextSnippets || [],
        },
      ]);
    } catch (error) {
      console.error("Error asking document copilot:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsAsking(false);
    }
  };

  const handleSubmit = async () => {
    await askQuestion(input);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[980px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5" />
            Document AI Copilot
          </DialogTitle>
          <DialogDescription>
            Ask questions about "{document?.fileName}" and
            get answers grounded in the document context.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Copilot request failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="rounded-xl border">
            <div className="border-b px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    Conversation
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ask for explanations, summaries, quiz
                    questions, definitions, or clarifications.
                  </p>
                </div>
                <Badge variant="outline">
                  {Math.floor(messages.length / 2)} exchanges
                </Badge>
              </div>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Start a conversation with this
                          document
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ask natural questions and the copilot
                          will answer using the document as
                          context.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          className="rounded-lg border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                          onClick={() => askQuestion(prompt)}
                          disabled={isAsking}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border bg-background"
                      )}
                    >
                      <div className="whitespace-pre-wrap leading-6">
                        {message.content}
                      </div>

                      {message.role === "assistant" &&
                      message.contextSnippets?.length ? (
                        <details className="mt-3 rounded-lg border bg-muted/30 p-3">
                          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                            View document context used
                          </summary>
                          <div className="mt-3 space-y-3">
                            {message.contextSnippets.map(
                              (snippet, index) => (
                                <div
                                  key={`${message.id}-${index}`}
                                  className="rounded-md border bg-background p-3"
                                >
                                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                                    Excerpt {index + 1}
                                  </p>
                                  <p className="whitespace-pre-wrap text-xs leading-5">
                                    {snippet}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </details>
                      ) : null}
                    </div>

                    {message.role === "user" ? (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
                ))}

                {isAsking ? (
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="max-w-[85%] rounded-2xl border bg-background px-4 py-3 text-sm shadow-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking through the document...
                      </div>
                    </div>
                  </div>
                ) : null}

                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Ask about this document
              </div>
              <span className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for a new line
              </span>
            </div>
            <Textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              disabled={isAsking || !document?.fileUrl}
              placeholder="Ask anything about this document..."
              className="min-h-[110px] resize-none"
            />
          </div>
          </div>   
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAsking}
            className="sm:order-1"
          >
            Close
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!canAsk}
            className="sm:order-2"
          >
            {isAsking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Asking...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ask Copilot
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
