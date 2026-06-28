import { motion } from "framer-motion";
import type { ChatMessage as Msg } from "@/hooks/useChat";
import { Markdown } from "./Markdown";
import { TypingIndicator } from "./TypingIndicator";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";

export function ChatMessage({ message, onOpenProject }: { message: Msg; onOpenProject: (id: string) => void }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[80%] px-4 py-3 text-[15px] text-text-primary"
          style={{
            background: "rgba(79,142,247,0.12)",
            border: "0.5px solid rgba(79,142,247,0.25)",
            borderRadius: "18px 18px 4px 18px",
          }}
        >
          {message.content}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message.status === "typing" && !message.content ? (
        <TypingIndicator />
      ) : (
        message.content && (
          <Markdown
            text={message.content}
            className="block text-[16px] leading-[1.75] text-text-secondary"
          />
        )
      )}
      {message.status === "done" && message.component && (
        <WidgetRenderer name={message.component} data={message.data} onOpenProject={onOpenProject} />
      )}
    </div>
  );
}
