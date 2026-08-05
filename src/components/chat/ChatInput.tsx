import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const magnet = useMagneticButton(0.25);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(79,142,247,0.08), rgba(255,255,255,0.05))`;
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  };

  return (
    <div
      className="sticky bottom-0 z-20 pt-4"
      style={{
        paddingBottom: "max(24px, var(--safe-bottom))",
        background: "linear-gradient(to top, #080809 62%, transparent)",
      }}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group relative flex items-end rounded-2xl border border-border-default px-[18px] py-[14px] transition-colors duration-200 focus-within:border-[rgba(79,142,247,0.4)]"
        style={{
          background: "rgba(255,255,255,0.05)",
          borderWidth: "0.5px",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          autoFocus
          disabled={disabled}
          placeholder="Ask me anything…  (try /dev)"
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") setValue("");
          }}
          className="max-h-40 w-full resize-none bg-transparent pr-10 text-[15px] leading-relaxed text-text-primary outline-none placeholder:text-text-muted"
        />
        <div className="absolute bottom-1.5 right-1.5 flex h-11 w-11 items-center justify-center">
          <button
            ref={magnet.ref}
            type="button"
            onClick={submit}
            onMouseMove={magnet.onMouseMove}
            onMouseLeave={magnet.onMouseLeave}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-blue text-[#080809] transition-[opacity,background] duration-200 disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
