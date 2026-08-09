import { useEffect } from "react";
import { useAppStore } from "@/store/app";

/**
 * 新消息弹窗（简洁系统通知横幅风格）
 * - 一次只显示最新的一条（不堆叠、不跳页面）
 * - 点击任意位置关闭，3 秒自动消失
 * - 样式：头像 + 上方（昵称 · 现在）+ 下方预览内容
 */
export default function MsgNotificationToasts() {
  const notifications = useAppStore((s) => s.msgNotifications);
  const dismissMsgNotification = useAppStore((s) => s.dismissMsgNotification);

  // 取最新一条显示
  const latest = notifications.length > 0 ? notifications[notifications.length - 1] : null;

  // 3 秒自动消失
  useEffect(() => {
    if (!latest) return;
    const remaining = 3000 - (Date.now() - latest.timestamp);
    const tid = window.setTimeout(() => dismissMsgNotification(latest.id), Math.max(0, remaining));
    return () => window.clearTimeout(tid);
  }, [latest?.id, dismissMsgNotification, latest?.timestamp]);

  if (!latest) return null;

  const close = () => dismissMsgNotification(latest.id);

  return (
    <div
      className="fixed z-[120] top-3 left-1/2 -translate-x-1/2 w-[min(520px,92vw)] pointer-events-none"
    >
      <div
        onClick={close}
        className="pointer-events-auto animate-toastIn rounded-2xl px-3 py-2.5 flex items-center gap-3 cursor-pointer shadow-lg backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--card) 94%, transparent)",
          border: "1px solid color-mix(in srgb, var(--card-border) 75%, transparent)",
          boxShadow:
            "0 10px 30px color-mix(in srgb, var(--text) 10%, transparent), 0 2px 6px color-mix(in srgb, var(--text) 4%, transparent)",
        }}
      >
        {/* 头像 */}
        <div className="shrink-0">
          {latest.senderAvatarImage ? (
            <img
              src={latest.senderAvatarImage}
              className="h-10 w-10 rounded-xl object-cover border"
              style={{ borderColor: "color-mix(in srgb, var(--card-border) 80%, transparent)" }}
              draggable={false}
            />
          ) : (
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-[15px] font-bold border"
              style={{
                borderColor: "color-mix(in srgb, var(--card-border) 80%, transparent)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--her-card) 75%, var(--card)))",
                color: "var(--text)",
              }}
            >
              {latest.senderAvatarText.slice(0, 1)}
            </div>
          )}
        </div>

        {/* 文字区 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="font-semibold text-[13px] truncate"
                style={{ color: "var(--text)" }}
              >
                {latest.senderName}
              </span>
              {latest.isGroup && (
                <span
                  className="shrink-0 rounded-full px-1.5 py-[1px] text-[10px] font-medium"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  {latest.conversationName}
                </span>
              )}
            </div>
            <span
              className="shrink-0 text-[11px]"
              style={{ color: "var(--text-soft)" }}
            >
              现在
            </span>
          </div>

          <div
            className="mt-0.5 text-[12px] leading-snug truncate"
            style={{ color: "color-mix(in srgb, var(--text) 82%, transparent)" }}
          >
            {latest.preview}
          </div>
        </div>
      </div>
    </div>
  );
}
