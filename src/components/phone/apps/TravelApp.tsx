import { useEffect, useState } from "react";
import { AppHeader } from "./HomeScreen";
import { useAppStore } from "@/store/app";
import { MapPin, CloudSun, Navigation, Clock, RefreshCw } from "lucide-react";

const TRAVEL_INTERVAL = 2 * 60 * 60 * 1000; // 2小时

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TravelApp({ onBack }: { onBack: () => void }) {
  const contacts = useAppStore((s) => s.contacts);
  const conversations = useAppStore((s) => s.conversations);
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const lastTravelUpdateAt = useAppStore((s) => s.lastTravelUpdateAt);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const contactId = activeConv?.type === "private" ? activeConv.memberIds[0] : contacts[0]?.id;
  const contact = contacts.find((c) => c.id === contactId);

  // 下次更新倒计时，每秒刷新
  const [remaining, setRemaining] = useState(() => {
    const nextAt = (lastTravelUpdateAt || 0) + TRAVEL_INTERVAL;
    return Math.max(nextAt - Date.now(), 0);
  });
  useEffect(() => {
    const tick = () => {
      const nextAt = (useAppStore.getState().lastTravelUpdateAt || 0) + TRAVEL_INTERVAL;
      setRemaining(Math.max(nextAt - Date.now(), 0));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [lastTravelUpdateAt]);

  if (!contact) return null;
  const travel = contact.status.travel;
  const travelCards = contact.cards.travel;

  // 立即刷新：重新随机抽取出行地点与今日行程
  const handleRefresh = () => {
    if (travelCards.length === 0) return;
    const randomCard = travelCards[Math.floor(Math.random() * travelCards.length)];
    const weathers = ["晴", "多云", "阴", "小雨", "微风", "晴转多云", "多云转阴"];
    const temps = [18, 20, 22, 24, 26, 28, 19, 21, 23, 25];
    const scheduleCount = Math.floor(Math.random() * 3) + 2; // 2-4个行程
    const newSchedule: { time: string; place: string; note?: string }[] = [];
    for (let i = 0; i < scheduleCount; i++) {
      const scheduleCard = travelCards[Math.floor(Math.random() * travelCards.length)];
      const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      newSchedule.push({
        time: `${hours[Math.floor(Math.random() * hours.length)]}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        place: scheduleCard.content,
        note: undefined,
      });
    }
    newSchedule.sort((a, b) => a.time.localeCompare(b.time));
    useAppStore.setState((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === contact.id
          ? {
              ...c,
              status: {
                ...c.status,
                travel: {
                  ...c.status.travel,
                  location: randomCard.content,
                  weather: weathers[Math.floor(Math.random() * weathers.length)],
                  temperature: temps[Math.floor(Math.random() * temps.length)],
                  schedule: newSchedule,
                },
              },
            }
          : c
      ),
      lastTravelUpdateAt: Date.now(),
    }));
  };

  return (
    <div>
      <AppHeader title="出行" onBack={onBack} />
      <div className="flex flex-col gap-3 px-3 py-3">
        {/* 地图位置卡 */}
        <div
          className="relative overflow-hidden rounded-2xl p-3"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), transparent)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-soft)" }}>
              <MapPin className="h-3 w-3" /> 当前位置
            </div>
            <div
              className="mt-0.5 font-serif text-base font-bold"
              style={{ color: "var(--text)" }}
            >
              {travel.location}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <CloudSun className="h-5 w-5" style={{ color: "#D97706" }} />
              <span className="text-[12px]" style={{ color: "var(--text)" }}>
                {travel.weather}
              </span>
              <span className="text-[12px]" style={{ color: "var(--text-soft)" }}>
                {travel.temperature}°C
              </span>
              <Navigation className="ml-auto h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
            </div>
          </div>
        </div>

        {/* 今日行程 */}
        <div
          className="rounded-xl p-3"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="mb-2 text-[11px]" style={{ color: "var(--text-soft)" }}>
            今日行程
          </div>
          <ul className="flex flex-col gap-2">
            {travel.schedule.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="flex flex-col items-center">
                  <span
                    className="font-stamp text-[11px]"
                    style={{ color: "var(--accent)" }}
                  >
                    {s.time}
                  </span>
                  {i < travel.schedule.length - 1 && (
                    <span className="mt-0.5 h-6 w-px" style={{ background: "var(--card-border)" }} />
                  )}
                </div>
                <div className="pb-0.5">
                  <div className="text-[12px]" style={{ color: "var(--text)" }}>
                    {s.place}
                  </div>
                  {s.note && (
                    <div className="text-[10px]" style={{ color: "var(--text-soft)" }}>
                      {s.note}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 出行地点字卡库 */}
        <div
          className="rounded-xl p-3"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>
              出行地点字卡库
            </div>
            <button
              onClick={handleRefresh}
              disabled={travelCards.length === 0}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] transition-opacity disabled:opacity-40"
              style={{
                background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              <RefreshCw className="h-3 w-3" /> 立即刷新
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: "var(--text-soft)" }}>字卡数量</span>
              <span style={{ color: "var(--text)" }}>{travelCards.length} 张</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: "var(--text-soft)" }}>当前选中地点</span>
              <span className="font-serif font-bold" style={{ color: "var(--accent)" }}>
                {travel.location}
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-1" style={{ color: "var(--text-soft)" }}>
                <Clock className="h-3 w-3" /> 下次更新
              </span>
              <span className="font-stamp" style={{ color: "var(--text)" }}>
                {formatCountdown(remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
