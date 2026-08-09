import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import FlightChessPage from "@/pages/FlightChessPage";
import ThemeApplier from "@/theme/ThemeApplier";
import FloatingPhone from "@/components/FloatingPhone";
import FloatingMusic from "@/components/FloatingMusic";
import MusicPlayerModal from "@/components/MusicPlayerModal";
import DriftBottleModal from "@/components/modals/DriftBottleModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import MsgNotificationToasts from "@/components/MsgNotificationToasts";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/app";

const hashBasename = import.meta.env.BASE_URL.replace(/\/$/, '');
const NOTIFICATION_ICON = "https://i.postimg.cc/ZKVRS4kH/retouch-2026071501420750.png";

// 需要预加载的本地资源（相对 BASE_URL）
const DRIFT_BOTTLE_IMAGES = [
  "driftbottle/bg.jpg",
  "driftbottle/coral.png",
  "driftbottle/pearl.png",
  "driftbottle/shell.png",
  "driftbottle/wave.png",
  "driftbottle/star.png",
  "driftbottle/envelope.png",
  "driftbottle/letter.jpg",
  "driftbottle/diary.jpg",
];

// 需要预加载的远程 CDN 图片（绝对 URL）
const REMOTE_IMAGES = [
  // 砸番茄图片（聊天头像、番茄动画）
  "https://i.postimg.cc/ZKVRS4kH/retouch-2026071501420750.png",
  // 主题背景图
  "https://i.postimg.cc/528g6Ysj/Screenshot-20260715-002626.jpg",
  "https://i.postimg.cc/sgfFjmg4/Screenshot-20260714-221404.jpg",
  "https://i.postimg.cc/KYKHjHST/Screenshot-20260714-221624.jpg",
  "https://i.postimg.cc/fy7yYCXD/retouch-2026071421514316.png",
  "https://i.postimg.cc/fW11dZT7/retouch-2026071422013733.png",
  "https://i.postimg.cc/BbwSTzbJ/retouch-2026071422075959.png",
  "https://i.postimg.cc/3xNpHMm4/Screenshot-20260714-220506.jpg",
  "https://i.postimg.cc/2yKvm8w7/Camera-XHS-17840462551361040g2sg317haqv5h3u705oq4lp3654ovo179du8.jpg",
];

export default function App() {
  const [notificationGranted, setNotificationGranted] = useState(false);
  const beauty = useAppStore((s) => s.beauty);
  const pushNotification = useAppStore((s) => s.chat.pushNotification);
  const lastMsgIdRef = useRef<string | null>(null);
  const lastMemoIdRef = useRef<string | null>(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationGranted(permission === "granted");
      });
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && notificationGranted && pushNotification) {
        document.title = "💬 苜蓿 · 有新消息";
      } else {
        document.title = "苜蓿";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [notificationGranted, pushNotification]);

  useEffect(() => {
    const checkNewMessage = () => {
      if (!notificationGranted || !document.hidden || !pushNotification) return;

      const state = useAppStore.getState();
      const activeConv = state.conversations.find((c) => c.id === state.activeConversationId);
      const messages = activeConv?.messages || [];
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.id === lastMsgIdRef.current) return;
      lastMsgIdRef.current = lastMsg.id;

      if (lastMsg.type === "system") {
        new Notification("苜蓿", {
          body: lastMsg.systemText,
          icon: NOTIFICATION_ICON,
        });
      } else if (lastMsg.sender !== "me" && lastMsg.text) {
        const senderName = lastMsg.sender === "her"
          ? beauty.herName
          : state.contacts.find((c) => c.id === lastMsg.sender)?.name || "对方";
        new Notification(`${senderName} 回复了你的消息`, {
          body: lastMsg.text.substring(0, 100),
          icon: NOTIFICATION_ICON,
        });
      }
    };

    const checkNewMemo = () => {
      if (!notificationGranted || !document.hidden || !pushNotification) return;

      const state = useAppStore.getState();
      const latest = state.memos[0];
      if (!latest || latest.id === lastMemoIdRef.current) return;
      lastMemoIdRef.current = latest.id;

      if (latest.from === "me") return;
      if (Date.now() - latest.timestamp > 10000) return;

      const senderName =
        state.contacts.find((c) => c.id === latest.from)?.name || beauty.herName;
      new Notification(`${senderName} 给你发来一封信`, {
        body: latest.text.substring(0, 100),
        icon: NOTIFICATION_ICON,
      });
    };

    const unsubscribe = useAppStore.subscribe(() => {
      checkNewMessage();
      checkNewMemo();
    });

    return unsubscribe;
  }, [notificationGranted, beauty.herName, pushNotification]);

  // ========== 新消息：浮窗 + 音效触发（全局统一入口） ==========
  useEffect(() => {
    // 记录脚本启动时间戳：只有晚于这一刻的消息才算"页面运行期间新到的消息"
    // 页面启动瞬间之前的消息（包括刚从 localStorage 恢复的历史）都不弹不响
    const SESSION_START_TS = Date.now();
    // 会话启动时已经存在的消息 id 集合（完全不提醒）
    const baselineMsgIds = new Set<string>();
    const initState = useAppStore.getState();
    initState.conversations.forEach((c) => c.messages.forEach((m) => baselineMsgIds.add(m.id)));
    let countMap: Record<string, number> = { ...(initState._notifMsgCountMap || {}) };
    // 首次把基线长度写回去，避免首帧 subscribe 就比大小
    initState.conversations.forEach((c) => { countMap[c.id] = c.messages.length; });
    try { useAppStore.setState({ _notifMsgCountMap: countMap } as any); } catch { /* noop */ }

    const handleNewMessages = () => {
      const s = useAppStore.getState();
      const prevMap = s._notifMsgCountMap || {};
      const nextMap: Record<string, number> = { ...prevMap };
      let changed = false;
      for (const conv of s.conversations) {
        const prev = prevMap[conv.id] ?? 0;
        const next = conv.messages.length;
        if (next <= prev) {
          if ((nextMap[conv.id] ?? 0) !== next) { nextMap[conv.id] = next; changed = true; }
          continue;
        }
        for (let i = prev; i < next; i++) {
          const msg = conv.messages[i];
          if (!msg) continue;
          // 三重过滤，避免旧消息 / 已读消息 / 我发的消息 弹窗和响铃：
          // 1) 页面启动前已存在的 id -> 跳过
          if (baselineMsgIds.has(msg.id)) continue;
          // 2) 时间戳在会话启动之前（比如持久化刚恢复）-> 跳过
          if (msg.timestamp < SESSION_START_TS) continue;
          // 3) 已经标记已读（比如对方回复的消息在写进来时就 readStatus: read）-> 跳过
          if (msg.readStatus === "read" || msg.readStatus === "ignored") continue;
          s.onIncomingMessage(conv.id, msg);
        }
        nextMap[conv.id] = next;
        changed = true;
      }
      if (changed) {
        try { useAppStore.setState({ _notifMsgCountMap: nextMap } as any); } catch { /* noop */ }
      }
    };

    const unsubscribe = useAppStore.subscribe(handleNewMessages);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // 预加载本地资源（漂流瓶等）
    DRIFT_BOTTLE_IMAGES.forEach((path) => {
      const img = new Image();
      img.src = `${hashBasename}/${path}`;
    });
    // 预加载远程 CDN 图片（砸番茄、主题背景）
    REMOTE_IMAGES.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // 对方主动写信：每30分钟给每段私聊4%概率随机发 5-9 条字卡合并成一条消息（聊天模块）
  useEffect(() => {
    const checkAndSendAutoLetters = () => {
      const state = useAppStore.getState();
      state.conversations.forEach((conv) => {
        if (conv.type !== "private") return;
        if (Math.random() >= 0.04) return; // 4% 概率
        const contactId = conv.memberIds[0];
        const contact = state.contacts.find((c) => c.id === contactId);
        if (!contact || !contact.cards?.chat || contact.cards.chat.length === 0) return;

        const chatCards = contact.cards.chat;
        const count = 5 + Math.floor(Math.random() * 5); // 5-9 条
        const shuffled = [...chatCards].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, Math.min(count, chatCards.length));

        if (picks.length === 0) return;

        // 合并成一条消息
        const combinedText = picks
          .map((card) => {
            if (card.name && card.content) return `${card.name}\n${card.content}`;
            return card.name || card.content || "";
          })
          .filter(Boolean)
          .join("\n\n");

        const msg = {
          id: `auto-letter-${Date.now()}`,
          sender: contactId,
          type: "text" as const,
          text: combinedText,
          timestamp: Date.now(),
          isAutoInitiated: true,
        };

        useAppStore.setState((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conv.id ? { ...c, messages: [...c.messages, msg] } : c
          ),
        }));
      });
    };

    const intervalId = window.setInterval(checkAndSendAutoLetters, 30 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <ThemeApplier />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/flight-chess"
              element={
                <ErrorBoundary
                  fallback={
                    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center text-white">
                      <div className="text-5xl">😵</div>
                      <h2 className="text-lg font-bold">飞行棋出了点问题</h2>
                      <button
                        onClick={() => {
                          sessionStorage.removeItem("flight-chess-entered");
                          window.location.hash = "#/";
                          setTimeout(() => {
                            window.location.href =
                              window.location.origin + window.location.pathname + window.location.search + "#/";
                          }, 50);
                        }}
                        className="rounded-full bg-white px-6 py-2 text-sm font-bold text-purple-600"
                      >
                        返回主页
                      </button>
                    </div>
                  }
                >
                  <FlightChessPage />
                </ErrorBoundary>
              }
            />
          </Routes>
        </Router>
      </ErrorBoundary>
      <ErrorBoundary fallback={<></>}>
        <FloatingPhone />
      </ErrorBoundary>
      <ErrorBoundary fallback={<></>}>
        <FloatingMusic />
      </ErrorBoundary>
      <ErrorBoundary fallback={<></>}>
        <MusicPlayerModal />
      </ErrorBoundary>
      <ErrorBoundary fallback={<></>}>
        <DriftBottleModal />
      </ErrorBoundary>
      <ErrorBoundary fallback={<></>}>
        <MsgNotificationToasts />
      </ErrorBoundary>
    </>
  );
}
