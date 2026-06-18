import { cn } from "@/lib/utils";
import { IconMessageChatbot, IconUser } from "@tabler/icons-react";

type Props = {
  from: "user" | "assistant";
  children: React.ReactNode;
};

export function Message({ from, children }: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl gap-3",
        from === "user" ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          from === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {from === "user" ? (
          <IconUser className="size-4" />
        ) : (
          <IconMessageChatbot className="size-4" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          from === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
