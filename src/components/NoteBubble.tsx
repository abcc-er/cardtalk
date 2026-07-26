import Avatar from "./Avatar";
import type { Message } from "@/types";
import { useAppStore } from "@/store/app";

interface Props {
  message: Message;
  side: "left" | "right";
  showAvatar: boolean;
}

export default function NoteBubble({ message, side, showAvatar }: Props) {
  const beauty = useAppStore((s) => s.beauty);
  const isLeft = side === "left";
  const card = message.card!;
  const time = new Date(message.timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 ${isLeft ? "justify-start" : "justify-end"}`}
    >
      {isLeft && (
        <div className="w-11 shrink-0">{showAvatar && <Avatar senderId={message.sender} />}</div>
      )}
      <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} max-w-[78%]`}>
        {/* 便签顶部：心情状态条 */}
        <div
          className="relative z-10 mb-[-2px] ml-3 rounded-t-lg px-3 py-1 text-[11px] font-medium animate-bubbleIn"
          style={{
            background: "var(--accent)",
            color: "var(--card)",
          }}
        >
          今日心情 · {message.noteMood || "平静"}
        </div>

        {/* 便签主体 */}
        <div
          className="relative animate-noteIn"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--accent) 6%, var(--card)) 0%, var(--card) 30%)",
            borderRadius: "0.5rem",
            border: "1px solid var(--card-border)",
            boxShadow:
              "0 8px 20px -8px rgba(0,0,0,0.18), 0 2px 6px -2px rgba(0,0,0,0.08)",
            transform: isLeft ? "rotate(-1deg)" : "rotate(1deg)",
          }}
        >
          {/* 便签顶部装饰线 */}
          <div
            className="absolute left-0 right-0 top-0 h-1 rounded-t-[0.5rem]"
            style={{ background: "var(--accent)", opacity: 0.25 }}
          />

          {/* 胶带装饰 */}
          <div
            className="absolute left-1/2 -top-2 h-4 w-12 -translate-x-1/2 rotate-[-2deg]"
            style={{
              background: "color-mix(in srgb, var(--accent) 25%, transparent)",
              borderRadius: "2px",
            }}
          />

          <div className="relative w-60 px-4 pt-5 pb-3">
            <div
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {card.content}
            </div>
          </div>
        </div>

        <span
          className="mt-1 px-1 text-[10px]"
          style={{ color: "color-mix(in srgb, var(--text) 50%, transparent)" }}
        >
          {time}
        </span>
      </div>
      {!isLeft && (
        <div className="w-11 shrink-0">{showAvatar && <Avatar senderId={message.sender} />}</div>
      )}
    </div>
  );
}
