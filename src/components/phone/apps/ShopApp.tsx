import { useState } from "react";
import { useAppStore } from "@/store/app";
import { AppHeader } from "./HomeScreen";
import { Plus, Trash, Edit, Check, ChevronDown, Wallet } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 简约线条 SVG 图标（stroke-only，currentColor，24x24 viewBox）        */
/* ------------------------------------------------------------------ */

const CupIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 杯身 */}
    <path d="M5 9h11v7a3 3 0 01-3 3H8a3 3 0 01-3-3V9z" />
    {/* 把手 */}
    <path d="M16 10h2a2.5 2.5 0 010 5h-1" />
    {/* 热气 */}
    <path d="M8 4c0 1-1 1.5-1 2.5M11 3.5c0 1-1 1.5-1 2.5M14 4c0 1-1 1.5-1 2.5" />
  </svg>
);

const CakeIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 蜡烛 */}
    <path d="M12 3v3" />
    <path d="M12 3.5a0.6 0.6 0 100-0.001" />
    {/* 蛋糕上层 */}
    <path d="M4 14c0-1.5 1.5-2 4-2s4 0.5 4 2" />
    <path d="M12 14c0-1.5 1.5-2 4-2s4 0.5 4 2" />
    {/* 蛋糕底座 */}
    <path d="M4 14h16v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5z" />
    <path d="M4 17h16" />
  </svg>
);

const FlowerIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 花瓣 */}
    <circle cx="12" cy="8" r="2.2" />
    <path d="M12 5.8a2.2 2.2 0 11-2 1.1M12 5.8a2.2 2.2 0 102 1.1" />
    <path d="M9.2 7a2.2 2.2 0 11-1 2.9M14.8 7a2.2 2.2 0 101 2.9" />
    {/* 茎与叶 */}
    <path d="M12 10.2V20" />
    <path d="M12 15c-1.5 0-2.5-1-3-2M12 17c1.5 0 2.5-1 3-2" />
  </svg>
);

const FoodIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 碗 */}
    <path d="M3 12h18a8 8 0 01-16 0z" transform="translate(0,1)" />
    <path d="M3 12h18" />
    {/* 热气 */}
    <path d="M9 6c0 1-1 1.5-1 2.5M12 5c0 1-1 1.5-1 2.5M15 6c0 1-1 1.5-1 2.5" />
    {/* 底座 */}
    <path d="M8 20h8" />
  </svg>
);

const GiftIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 盒身 */}
    <path d="M4 9h16v4H4z" />
    <path d="M5 13h14v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7z" />
    <path d="M12 9v12" />
    {/* 蝴蝶结 */}
    <path d="M12 9c-1.5-2-4-2.5-4.5-1S8.5 9 12 9z" />
    <path d="M12 9c1.5-2 4-2.5 4.5-1S15.5 9 12 9z" />
  </svg>
);

const DeviceIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 手机 */}
    <path d="M7 3h7a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path d="M10 18h1" />
    {/* 耳机 */}
    <path d="M17 7a4 4 0 014 4v3" />
    <path d="M20 14h1.5a0.5 0.5 0 01.5.5v3a0.5 0.5 0 01-.5.5H20a1 1 0 01-1-1v-2a1 1 0 011-1z" />
  </svg>
);

const ClothingIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 衣服 */}
    <path d="M8 3l-5 3 2 4 3-1v9a1 1 0 001 1h6a1 1 0 001-1v-9l3 1 2-4-5-3" />
    <path d="M9 3a3 3 0 006 0" />
    <path d="M9 17h6" />
  </svg>
);

const DefaultIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 购物袋 */}
    <path d="M6 7h12l-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7z" />
    <path d="M9 7a3 3 0 016 0" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* 根据商品名匹配简约线条图标                                          */
/* ------------------------------------------------------------------ */

function ProductIcon({ name, size = 24 }: { name: string; size?: number }) {
  const lowerName = name.toLowerCase();
  // 饮品类
  if (
    lowerName.includes("奶茶") ||
    lowerName.includes("茶") ||
    lowerName.includes("咖啡") ||
    lowerName.includes("coffee") ||
    lowerName.includes("tea")
  )
    return <CupIcon size={size} />;
  // 蛋糕甜点类
  if (
    lowerName.includes("蛋糕") ||
    lowerName.includes("甜") ||
    lowerName.includes("cake") ||
    lowerName.includes("dessert")
  )
    return <CakeIcon size={size} />;
  // 花类
  if (lowerName.includes("花") || lowerName.includes("flower") || lowerName.includes("玫瑰"))
    return <FlowerIcon size={size} />;
  // 食物类
  if (
    lowerName.includes("面") ||
    lowerName.includes("noodle") ||
    lowerName.includes("汉堡") ||
    lowerName.includes("burger") ||
    lowerName.includes("披萨") ||
    lowerName.includes("pizza")
  )
    return <FoodIcon size={size} />;
  // 礼物类
  if (lowerName.includes("礼") || lowerName.includes("gift"))
    return <GiftIcon size={size} />;
  // 电子数码类
  if (
    lowerName.includes("手机") ||
    lowerName.includes("phone") ||
    lowerName.includes("耳机") ||
    lowerName.includes("headphone") ||
    lowerName.includes("电脑") ||
    lowerName.includes("book") ||
    lowerName.includes("书")
  )
    return <DeviceIcon size={size} />;
  // 服装类
  if (
    lowerName.includes("衣") ||
    lowerName.includes("鞋") ||
    lowerName.includes("shirt") ||
    lowerName.includes("shoe") ||
    lowerName.includes("裙") ||
    lowerName.includes("dress")
  )
    return <ClothingIcon size={size} />;
  // 默认图标
  return <DefaultIcon size={size} />;
}

/** 根据商品名给出一句简短描述，增强外卖平台观感 */
function describeProduct(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("奶茶") || n.includes("茶") || n.includes("coffee") || n.includes("咖啡"))
    return "现做现送";
  if (n.includes("蛋糕") || n.includes("甜") || n.includes("cake") || n.includes("dessert"))
    return "新鲜烘焙";
  if (n.includes("花") || n.includes("flower") || n.includes("玫瑰")) return "今日特供";
  if (n.includes("面") || n.includes("noodle")) return "热气腾腾";
  if (n.includes("汉堡") || n.includes("burger")) return "现烤现做";
  if (n.includes("披萨") || n.includes("pizza")) return "芝士拉丝";
  if (n.includes("礼") || n.includes("gift")) return "精心打包";
  if (n.includes("手机") || n.includes("phone") || n.includes("电脑")) return "正品现货";
  if (n.includes("耳机") || n.includes("headphone")) return "原厂品质";
  if (n.includes("书") || n.includes("book")) return "畅销推荐";
  if (n.includes("衣") || n.includes("shirt") || n.includes("裙") || n.includes("dress"))
    return "当季新款";
  if (n.includes("鞋") || n.includes("shoe")) return "舒适百搭";
  return "精选好物";
}

/* ------------------------------------------------------------------ */
/* 主组件                                                              */
/* ------------------------------------------------------------------ */

export default function ShopApp({ onBack }: { onBack: () => void }) {
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const conversations = useAppStore((s) => s.conversations);
  const getShopData = useAppStore((s) => s.getShopData);
  const setMyBalance = useAppStore((s) => s.setMyBalance);
  const setHerBalance = useAppStore((s) => s.setHerBalance);
  const addProduct = useAppStore((s) => s.addProduct);
  const deleteProduct = useAppStore((s) => s.deleteProduct);
  const buyProduct = useAppStore((s) => s.buyProduct);
  const buyProductByMe = useAppStore((s) => s.buyProductByMe);

  const [editingBalance, setEditingBalance] = useState<"my" | "her" | null>(null);
  const [balanceInput, setBalanceInput] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  // 给对方买时的留言
  const [buyForHerMessageId, setBuyForHerMessageId] = useState<string | null>(null);
  const [leaveMessage, setLeaveMessage] = useState("");

  const conv = conversations.find((c) => c.id === activeConversationId);
  const contactId = conv?.type === "private" ? conv.memberIds[0] : "";

  if (!contactId) {
    return (
      <div>
        <AppHeader title="小铺子" onBack={onBack} />
        <div
          className="px-4 py-6 text-center text-[12px]"
          style={{ color: "var(--text-soft)" }}
        >
          请先选择一个联系人
        </div>
      </div>
    );
  }

  const shop = getShopData(contactId);

  const startEditBalance = (which: "my" | "her") => {
    setEditingBalance(which);
    setBalanceInput(String(which === "my" ? shop.myBalance : shop.herBalance));
  };

  const confirmEditBalance = () => {
    const amount = parseFloat(balanceInput);
    if (!isNaN(amount) && amount >= 0) {
      if (editingBalance === "my") setMyBalance(contactId, amount);
      else if (editingBalance === "her") setHerBalance(contactId, amount);
    }
    setEditingBalance(null);
    setBalanceInput("");
  };

  const handleAddProduct = () => {
    const name = newName.trim();
    const price = parseFloat(newPrice);
    if (!name || isNaN(price) || price < 0) return;
    addProduct(contactId, name, price, "");
    setNewName("");
    setNewPrice("");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="小铺子" onBack={onBack} />
      <div className="fancy-scroll flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {/* 1. 钱包卡片：上下分割显示两个余额 */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          {/* 我的钱包 */}
          <div
            className="px-4 py-3"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent) 0%, color-mix(in srgb, var(--accent) 4%, transparent) 100%)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-soft)" }}>
                <Wallet className="h-3.5 w-3.5" />
                <span>我的钱包</span>
              </div>
              {editingBalance === "my" ? (
                <div className="flex items-center gap-1">
                  <input
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    type="number"
                    autoFocus
                    className="w-20 rounded-lg border px-2 py-0.5 text-right text-[12px]"
                    style={{
                      borderColor: "var(--card-border)",
                      background: "var(--card)",
                      color: "var(--text)",
                    }}
                  />
                  <button
                    onClick={confirmEditBalance}
                    className="flex h-6 w-6 items-center justify-center rounded-md transition active:scale-90"
                    style={{ background: "var(--accent)", color: "var(--card)" }}
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setEditingBalance(null)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-[11px]"
                    style={{ background: "var(--bg-deep)", color: "var(--text-soft)" }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditBalance("my")}
                  className="flex h-6 w-6 items-center justify-center rounded-md transition active:scale-90"
                  style={{ color: "var(--text-soft)" }}
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="mt-1 flex items-end gap-1">
              <span
                className="font-serif text-2xl font-bold leading-none"
                style={{ color: "var(--text)" }}
              >
                ¥ {shop.myBalance}
              </span>
            </div>
          </div>

          {/* 分割线 */}
          <div style={{ height: 1, background: "var(--card-border)" }} />

          {/* 对方余额 */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-soft)" }}>
              <span>对方余额</span>
            </div>
            {editingBalance === "her" ? (
              <div className="flex items-center gap-1">
                <input
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  type="number"
                  autoFocus
                  className="w-20 rounded-lg border px-2 py-0.5 text-right text-[12px]"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--card)",
                    color: "var(--text)",
                  }}
                />
                <button
                  onClick={confirmEditBalance}
                  className="flex h-6 w-6 items-center justify-center rounded-md transition active:scale-90"
                  style={{ background: "var(--accent)", color: "var(--card)" }}
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setEditingBalance(null)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[11px]"
                  style={{ background: "var(--bg-deep)", color: "var(--text-soft)" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="font-serif text-sm font-bold"
                  style={{ color: "var(--text)" }}
                >
                  ¥ {shop.herBalance}
                </span>
                <button
                  onClick={() => startEditBalance("her")}
                  className="flex h-5 w-5 items-center justify-center rounded-md transition active:scale-90"
                  style={{ color: "var(--text-soft)" }}
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. 商品列表（外卖风格，可独立滚动） */}
        <div
          className="flex flex-col rounded-2xl p-3"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            maxHeight: "280px",
          }}
        >
          <div className="mb-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-serif text-sm font-bold"
                style={{ color: "var(--text)" }}
              >
                热门商品
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-soft)" }}>
                {shop.products.length} 件
              </span>
            </div>
            <button
              onClick={() => setShowAdd((v) => !v)}
              className="flex h-6 w-6 items-center justify-center rounded-full transition active:scale-90"
              style={{ background: "var(--accent)", color: "var(--card)" }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {shop.products.length === 0 ? (
            <div
              className="flex-1 py-6 text-center text-[11px]"
              style={{ color: "var(--text-soft)" }}
            >
              还没有商品，点击 + 添加吧～
            </div>
          ) : (
            <div className="fancy-scroll flex-1 overflow-y-auto">
              <div className="flex flex-col divide-y" style={{ borderColor: "var(--card-border)" }}>
              {shop.products.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-2.5 py-2"
                  style={{ borderColor: "var(--card-border)" }}
                >
                  {/* 图标 */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <ProductIcon name={p.name} size={22} />
                  </div>
                  {/* 右侧内容：两行布局 */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* 第一行：名称 + 价格 + 删除 */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className="truncate text-[12px] font-bold flex-1 min-w-0"
                        style={{ color: "var(--text)" }}
                        title={p.name}
                      >
                        {p.name}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="font-serif text-[13px] font-bold"
                          style={{ color: "var(--accent)" }}
                        >
                          ¥{p.price}
                        </span>
                        <button
                          onClick={() => deleteProduct(contactId, p.id)}
                          className="flex h-4 w-4 items-center justify-center rounded-md transition active:scale-90"
                          style={{ color: "var(--text-soft)" }}
                          aria-label="删除"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {/* 第二行：描述 + 操作按钮 */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div
                        className="truncate text-[10px] flex-1 min-w-0"
                        style={{ color: "var(--text-soft)" }}
                      >
                        {describeProduct(p.name)}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => buyProduct(activeConversationId, p.id)}
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium transition active:scale-95"
                          style={{ background: "var(--accent)", color: "var(--card)" }}
                        >
                          求买
                        </button>
                        <button
                          onClick={() => {
                            setBuyForHerMessageId(p.id);
                            setLeaveMessage("");
                          }}
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium transition active:scale-95"
                          style={{
                            background: "var(--card)",
                            color: "var(--accent)",
                            border: "1px solid var(--accent)",
                          }}
                        >
                          我买
                        </button>
                      </div>
                    </div>
                    {/* 留言弹窗 */}
                    {buyForHerMessageId === p.id && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <input
                          autoFocus
                          value={leaveMessage}
                          onChange={(e) => setLeaveMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              buyProductByMe(activeConversationId, p.id, leaveMessage.trim() || undefined);
                              setBuyForHerMessageId(null);
                              setLeaveMessage("");
                            }
                          }}
                          placeholder="给她留句话（可选）"
                          className="flex-1 rounded-md border px-2 py-1 text-[11px]"
                          style={{
                            borderColor: "var(--card-border)",
                            background: "var(--card)",
                            color: "var(--text)",
                          }}
                        />
                        <button
                          onClick={() => {
                            buyProductByMe(activeConversationId, p.id, leaveMessage.trim() || undefined);
                            setBuyForHerMessageId(null);
                            setLeaveMessage("");
                          }}
                          className="rounded-md px-2 py-1 text-[10px]"
                          style={{ background: "var(--accent)", color: "var(--card)" }}
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            setBuyForHerMessageId(null);
                            setLeaveMessage("");
                          }}
                          className="rounded-md px-1.5 py-1 text-[10px]"
                          style={{
                            border: "1px solid var(--card-border)",
                            color: "var(--text-soft)",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. 添加商品（折叠式） */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-3 text-left"
          >
            <span
              className="font-serif text-sm font-bold"
              style={{ color: "var(--text)" }}
            >
              添加商品
            </span>
            <ChevronDown
              className="h-4 w-4 transition-transform"
              style={{
                color: "var(--text-soft)",
                transform: showAdd ? "rotate(180deg)" : "none",
              }}
            />
          </button>
          {showAdd && (
            <div className="flex flex-col gap-2 px-3 pb-3">
              <div className="flex items-start gap-2">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  <ProductIcon name={newName || "商品"} size={26} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="商品名称"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--card-border)",
                      background: "var(--card)",
                      color: "var(--text)",
                    }}
                  />
                  <input
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="价格"
                    type="number"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--card-border)",
                      background: "var(--card)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                className="rounded-lg px-3 py-2 text-sm font-medium transition active:scale-95"
                style={{ background: "var(--accent)", color: "var(--card)" }}
              >
                添加商品
              </button>
            </div>
          )}
        </div>

        {/* 6. 购买记录（折叠式） */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-3 text-left"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="font-serif text-sm font-bold"
                style={{ color: "var(--text)" }}
              >
                购买记录
              </span>
              {shop.purchases.length > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px]"
                  style={{ background: "var(--bg-deep)", color: "var(--text-soft)" }}
                >
                  {shop.purchases.length}
                </span>
              )}
            </div>
            <ChevronDown
              className="h-4 w-4 transition-transform"
              style={{
                color: "var(--text-soft)",
                transform: showHistory ? "rotate(180deg)" : "none",
              }}
            />
          </button>
          {showHistory && (
            <div className="px-3 pb-3">
              {shop.purchases.length === 0 ? (
                <div
                  className="py-4 text-center text-[11px]"
                  style={{ color: "var(--text-soft)" }}
                >
                  还没有购买记录～
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {[...shop.purchases].reverse().map((pur) => (
                    <div
                      key={pur.id}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                      style={{ background: "var(--bg-deep)" }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ color: "var(--accent)" }}
                      >
                        <ProductIcon name={pur.productName} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="truncate text-[12px]"
                          style={{ color: "var(--text)" }}
                        >
                          {pur.productName}
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-soft)" }}>
                          {formatTime(pur.timestamp)} ·{" "}
                          {pur.buyer === "her" ? "对方购买" : "我购买"}
                        </div>
                      </div>
                      <span
                        className="shrink-0 text-[11px] font-bold"
                        style={{ color: "var(--accent)" }}
                      >
                        -¥{pur.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
