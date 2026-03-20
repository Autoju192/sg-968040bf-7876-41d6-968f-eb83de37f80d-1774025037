import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * AI Help Assistant Page
 * Chat interface for getting help with TenderFlow AI
 */
export default function AIHelpAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your TenderFlow AI Help Assistant. I can help you with:\n\n• Connecting Gmail or tender portals\n• Understanding AI scoring\n• Using the document generator\n• Managing your inbox\n• Troubleshooting sync issues\n\nWhat would you like help with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How do I connect Gmail?",
    "What does the AI score mean?",
    "How do I generate a method statement?",
    "Why isn't my connection syncing?",
    "How do I respond to a clarification?",
    "How do I track submitted bids?",
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call AI API to get response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: `You are a helpful assistant for TenderFlow AI, a tender management platform for UK care providers. 
          
Help users with:
- Setting up portal connections (Gmail, Find a Tender, Contracts Finder, Link Watcher)
- Understanding AI scoring and bid/no-bid recommendations
- Using the document generator and evidence library
- Managing their tender inbox
- Troubleshooting sync issues
- Collaboration features (tasks, comments)
- Best practices for winning tenders

Keep responses clear, concise, and practical. Use UK English. Reference specific features and pages in TenderFlow AI. Provide step-by-step instructions when appropriate.`,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm having trouble responding right now. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or visit our tutorial library for help.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/help">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Back to Help Center
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Help Assistant</h1>
              <p className="text-muted-foreground">Get instant answers to your questions</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="flex flex-col h-[600px]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question about TenderFlow AI..."
                className="min-h-[60px] resize-none"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>

        {/* Help Resources */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/help">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <HelpCircle className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Tutorial Library</h3>
              <p className="text-sm text-muted-foreground">
                Browse all feature guides and tutorials
              </p>
            </Card>
          </Link>
          <Link href="/help/onboarding">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <Sparkles className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Quick Start Guide</h3>
              <p className="text-sm text-muted-foreground">
                Get up and running in 5 minutes
              </p>
            </Card>
          </Link>
          <Link href="/help/troubleshooting">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <HelpCircle className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Troubleshooting</h3>
              <p className="text-sm text-muted-foreground">
                Fix common issues quickly
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
}