"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Message } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconArrowUp, IconLoader2, IconMessageChatbot } from "@tabler/icons-react";
import { Typography } from "@/components/ui/typography";

export default function ChatPage() {
  const chat = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {chat.messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <IconMessageChatbot className="size-8 text-primary" />
            </div>
            <Typography variant="h4" className="mb-1">Assistant IA</Typography>
            <Typography variant="muted" className="max-w-sm">
              Posez-moi des questions sur vos campagnes, événements, stocks, ou
              tout autre sujet lié à votre activité.
            </Typography>
          </div>
        )}

        {chat.messages.map((m) => (
          <Message key={m.id} from={m.role as "user" | "assistant"}>
            {m.parts?.map((p, i) =>
              p.type === "text" ? <span key={i}>{p.text}</span> : null,
            )}
          </Message>
        ))}

        {isLoading && (
          <Message from="assistant">
            <span className="flex items-center gap-2">
              <IconLoader2 className="size-4 animate-spin" />
              Réflexion...
            </span>
          </Message>
        )}

        {chat.error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Erreur : {chat.error.message}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-background p-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;
            await chat.sendMessage({ text: input });
            setInput("");
          }}
          className="mx-auto flex w-full max-w-3xl items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ton message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <IconArrowUp className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
