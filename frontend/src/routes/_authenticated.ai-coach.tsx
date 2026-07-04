import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import axios from "axios";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { aiCoachService, type AIMessage } from "@/services/aiCoach";

export const Route = createFileRoute("/_authenticated/ai-coach")({
  head: () => ({ meta: [{ title: "AI Coach — DisciplineOS" }] }),
  component: AICoachPage,
});

function AICoachPage() {
  const {
    data: history,
    loading,
    error,
    refetch,
  } = useApi<AIMessage[]>(() => aiCoachService.history(), []);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSendError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const { reply } = await aiCoachService.send(text);
      setMessages((m) => [...m, reply]);
    } catch (err) {
      let msg = "Message failed to send";
      if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
      else if (err instanceof Error) msg = err.message;
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Coach"
        title="Talk to your discipline coach"
        description="Trained on your logs, habits, and streaks."
      />

      <div className="glass-strong rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-3">
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-14 w-2/3" />
              <Skeleton className="h-20 w-3/4 ml-auto" />
              <Skeleton className="h-14 w-1/2" />
            </div>
          )}

          {!loading && error && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="relative w-14 h-14 mb-5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-accent to-cyan-accent animate-pulse-glow" />
                <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Ask me anything</h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
                Try: "Why did I miss my streak Tuesday?" or "Plan my week for max focus."
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={m._id ?? i} role={m.role} content={m.content} />
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-purple-accent/15 to-cyan-accent/10 border border-purple-accent/20">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {sendError && <div className="text-xs text-destructive text-center">{sendError}</div>}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="p-4 border-t border-white/5">
          <div className="glass rounded-full flex items-center pl-4 pr-1.5 py-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach anything…"
              disabled={sending}
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-accent to-cyan-accent flex items-center justify-center disabled:opacity-40"
            >
              <ArrowUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-white/[0.08] border border-white/10"
            : "bg-gradient-to-br from-purple-accent/15 to-cyan-accent/10 border border-purple-accent/20"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
