import { useState, useCallback } from "react";
import { AppHeader } from "./HomeScreen";
import {
  MessageCircle,
  Eye,
  Sticker,
  Gift,
  Gamepad2,
  Vote,
  ClipboardList,
  Music,
  Smartphone,
  Waves,
  Cat,
  Palette,
  Settings,
  ShoppingBag,
  Save,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Hand,
  Timer,
  Undo2,
  Mail,
} from "lucide-react";

interface TutorialPage {
  icon: React.ReactNode;
  title: string;
  color: string;
  sections: { label?: string; desc: string }[];
}

const PAGES: TutorialPage[] = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "欢迎来到苜蓿",
    color: "#FF6B9D",
    sections: [
      { label: "什么是苜蓿", desc: "一个字卡传讯模拟网站，随机抽取字卡组成对话，并非 AI 软件" },
      { label: "怎么玩", desc: "在聊天界面输入文字发送即可，对方会从字卡库随机抽字卡回复你" },
      { label: "字卡库", desc: "在「设置 → 字卡库」中可以自定义对方的回复字卡内容" },
    ],
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: "聊天基础",
    color: "#3A7CA5",
    sections: [
      { label: "发送消息", desc: "在底部输入框打字，按发送按钮或回车键即可发送" },
      { label: "连续消息", desc: "你连续发送的消息会紧贴在一起，间距更紧凑美观" },
      { label: "时间位置", desc: "对方发的消息，时间会显示在「昵称旁边」，气泡下方不再重复显示" },
      { label: "多人群聊", desc: "点击右上角切换会话，支持私聊和群聊两种模式" },
      { label: "群聊入口开关", desc: "在「设置 → 聊天设置 → 群聊入口开关」关闭后，切换联系人界面不会再显示群聊" },
      { label: "引用回复", desc: "长按消息弹出菜单，选择「引用」即可引用该条消息回复" },
    ],
  },
  {
    icon: <Hand className="h-8 w-8" />,
    title: "互动小彩蛋",
    color: "#F67280",
    sections: [
      { label: "双击头像拍一拍", desc: "双击对方的头像，可以「拍一拍」对方，头像会弹一下" },
      { label: "双击名字扔番茄", desc: "双击消息上方的名字/称呼，会弹出扔番茄选择，最多扔好几个" },
      { label: "长按头像摸摸宠物", desc: "长按我自己的头像，进入宠物藏匿模式，把小宠物藏进某条消息里" },
      { label: "长按消息菜单", desc: "长按任意一条消息，可以引用、撤回（限自己的）、删除该条消息" },
    ],
  },
  {
    icon: <Timer className="h-8 w-8" />,
    title: "主动发消息 & 通知提醒",
    color: "#FFB347",
    sections: [
      { label: "对方主动来信", desc: "在「设置 → 聊天设置 → 主动发消息」打开，对方会间隔给你主动发消息" },
      { label: "主动来信自动入备忘录", desc: "对方主动写的信会自动记进「备忘录」里，方便以后翻" },
      { label: "主动发信封 / 写回信", desc: "对方主动给你写信，你也可以写回信，仪式感拉满" },
      { label: "新消息横幅弹窗", desc: "其他会话来了新消息，顶部会弹系统通知一样的横幅，点击只关闭不跳转（避免卡顿）" },
      { label: "横幅提示音", desc: "提示音有 5 种预设 + 自定义上传音效 + 音量滑块，都在「设置 → 聊天设置 → 新消息浮窗 & 提示音」里" },
      { label: "喝水提醒", desc: "开启后有概率弹出喝水提醒，别只顾着聊天忘了喝水～" },
      { label: "后台推送", desc: "后台标签页时对方回复会弹出浏览器通知，记得给网站通知权限喔" },
    ],
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "已读 与 已读不回",
    color: "#E74C3C",
    sections: [
      { label: "1~3 秒判定", desc: "你发出的消息会在 1~3 秒随机时间后判定是否已读或已读不回" },
      { label: "已读标注", desc: "正常已读时，消息左下角（头像旁边）显示「已读 + 时间」" },
      { label: "已读不回", desc: "已读不回时，头像右上角出现红色 ^^ 猫耳（最新一条才标），左下角显示红字「已读不回」" },
      { label: "可独立开关", desc: "在「设置 → 聊天设置」可分别开关已读标注显示 和 已读不回 触发概率" },
    ],
  },
  {
    icon: <Undo2 className="h-8 w-8" />,
    title: "撤回消息",
    color: "#95a5a6",
    sections: [
      { label: "自己撤回", desc: "长按自己发的消息，在菜单中选择「撤回」即可撤回" },
      { label: "对方撤回", desc: "对方有小概率撤回自己刚发的消息，显示「xxx 撤回了一条消息」" },
      { label: "可以开关", desc: "「设置 → 聊天设置 → 对方撤回消息」中可以独立关闭对方自动撤回" },
    ],
  },
  {
    icon: <Sticker className="h-8 w-8" />,
    title: "表情包 与 图片",
    color: "#F06292",
    sections: [
      { label: "发送表情包", desc: "点击输入框左侧的表情图标，选择表情包发送" },
      { label: "自定义表情", desc: "在「设置 → 字卡库 → 表情包」中可以添加自己的表情包" },
      { label: "发送图片", desc: "点击输入框右侧的图片图标，可以选择并发送图片" },
      { label: "引用表情包", desc: "别人引用你的表情包时，会以小缩略图形式展示，不会只显示「表情包」三个字" },
    ],
  },
  {
    icon: <Gift className="h-8 w-8" />,
    title: "红包 & 礼物",
    color: "#E91E63",
    sections: [
      { label: "私聊红包", desc: "私聊中点击红包图标发送红包，会弹出「领取 / 退回」的简约线条小弹窗" },
      { label: "群聊手气红包", desc: "群聊里可以设定金额和领取人数，随机金额，抢到最多的头像右上角标「👑」并显示手气王" },
      { label: "红包可折叠", desc: "群聊红包右上角有小箭头，可一键折叠/展开下方的抢包记录与评论" },
      { label: "抢完评论", desc: "群友无论抢到还是抢完了，都会用自己字卡里随机一条字卡评论在下方" },
      { label: "礼物领取", desc: "对方送你礼物时会弹出简约线条领取弹窗，点「开心收下并致谢」就收下并自动回一句谢谢" },
      { label: "礼物记录", desc: "我送对方 / 对方送我 都会自动记录到手机小应用「商店」的购买记录里" },
    ],
  },
  {
    icon: <Gamepad2 className="h-8 w-8" />,
    title: "猜拳对战",
    color: "#FF6B6B",
    sections: [
      { label: "发起猜拳", desc: "在聊天页右上角菜单中选择「猜拳」即可发起" },
      { label: "石头剪刀布", desc: "选择你的出招，系统随机生成对方出招" },
      { label: "对战结果", desc: "以卡片形式展示双方出招和胜负结果" },
    ],
  },
  {
    icon: <Vote className="h-8 w-8" />,
    title: "群聊投票",
    color: "#9C6ADE",
    sections: [
      { label: "发起投票", desc: "在聊天页右上角菜单中选择「投票」创建投票" },
      { label: "多选项", desc: "可以设置多个投票选项，群成员参与投票" },
      { label: "实时结果", desc: "投票结果以进度条展示，实时更新" },
    ],
  },
  {
    icon: <ClipboardList className="h-8 w-8" />,
    title: "问卷",
    color: "#9C6ADE",
    sections: [
      { label: "发送问卷", desc: "在手机小应用中打开「问卷」，选择或创建问卷发送" },
      { label: "问卷类型", desc: "支持选择题、填空题等多种题型" },
      { label: "查看回答", desc: "对方回答后可以查看问卷结果" },
    ],
  },
  {
    icon: <Music className="h-8 w-8" />,
    title: "一起听歌",
    color: "#E91E63",
    sections: [
      { label: "发送音乐", desc: "在手机小应用中打开「音乐」，选择歌曲发送给对方" },
      { label: "悬浮播放器", desc: "播放时屏幕出现悬浮控件，可随时控制播放" },
      { label: "全屏播放", desc: "点击悬浮控件进入全屏播放器，展示歌词和封面" },
    ],
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "手机小应用",
    color: "#FF8A65",
    sections: [
      { label: "三餐打卡", desc: "记录每日三餐，发送到聊天中分享" },
      { label: "心情记录", desc: "选择当前心情，以字卡形式发送" },
      { label: "身体状态", desc: "记录身体状态，关心对方健康" },
      { label: "工作 & 出行", desc: "分享工作动态和出行信息" },
      { label: "天气", desc: "查看当前天气，支持动画效果" },
    ],
  },
  {
    icon: <Waves className="h-8 w-8" />,
    title: "漂流瓶",
    color: "#0066B3",
    sections: [
      { label: "拾取漂流瓶", desc: "在手机小应用中打开「漂流瓶」，拾取海上的瓶子" },
      { label: "写信 & 寄出", desc: "可以写一封信装进瓶子扔进海里" },
      { label: "贝壳日记", desc: "用贝壳记录心情，封存美好回忆" },
    ],
  },
  {
    icon: <Mail className="h-8 w-8" />,
    title: "信封来信",
    color: "#8B6DB8",
    sections: [
      { label: "仪式感信封", desc: "对方主动给你写信时，会以信封简笔画的形式弹出提示：「对方给我写了一封信」" },
      { label: "点开查看", desc: "点击信封即可打开，阅读里面的信件内容" },
      { label: "写回信", desc: "看完后你可以写一封回信给对方，同样装进信封里寄出" },
    ],
  },
  {
    icon: <Cat className="h-8 w-8" />,
    title: "桌面宠物",
    color: "#FF9EB3",
    sections: [
      { label: "养宠物", desc: "在「设置 → 美化」中开关宠物，或在手机小应用中打开「宠物」DIY" },
      { label: "互动", desc: "可以摸摸它、喂食，宠物会有不同反应" },
      { label: "藏宠物玩法", desc: "长按自己头像进入藏匿模式，把宠物藏在消息背后，看谁先找到" },
      { label: "关闭就没提示", desc: "关闭宠物后，不会再弹出「找到了宠物」「没找到」等提示" },
    ],
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "主题美化",
    color: "#F06292",
    sections: [
      { label: "多套主题", desc: "在「设置 → 美化」中切换不同主题风格" },
      { label: "气泡样式", desc: "不同主题有不同的聊天气泡样式和配色" },
      { label: "全局配色", desc: "主题会影响整个网站的背景、文字、图标颜色" },
    ],
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "聊天设置",
    color: "#7CB342",
    sections: [
      { label: "回复速度", desc: "调节对方回复你的速度，从慢到快可选" },
      { label: "回复条数", desc: "私聊和群聊分别调节对方回复的条数范围（1~12 条，默认 1~3 条）" },
      { label: "主动发消息", desc: "开启后对方会主动给你发消息，模拟真实聊天" },
      { label: "新消息浮窗 & 提示音", desc: "开关横幅弹窗、当前会话是否弹窗、5 种预设提示音/自定义上传/音量调节" },
      { label: "群聊入口开关", desc: "关闭后，在「切换联系人」界面不会再显示群聊相关入口（群聊数据保留）" },
      { label: "喝水提醒", desc: "定时提醒喝水，关心你的健康" },
      { label: "后台推送", desc: "开启后即使不在聊天页也能收到消息提醒" },
    ],
  },
  {
    icon: <ShoppingBag className="h-8 w-8" />,
    title: "商店 与 好物",
    color: "#FF8C42",
    sections: [
      { label: "好物推荐 / 对方送你礼物", desc: "手机小应用「商店」会挑选礼物，对方也会主动送礼物给你" },
      { label: "发送商品", desc: "选择商品发送到聊天中，以卡片形式展示" },
      { label: "飞行棋", desc: "在手机小应用中打开「飞行棋」，和对方一起玩" },
    ],
  },
  {
    icon: <Save className="h-8 w-8" />,
    title: "数据备份",
    color: "#5C9EFF",
    sections: [
      { label: "导出数据", desc: "在「设置 → 备份」中导出所有聊天记录和配置" },
      { label: "导入数据", desc: "可以导入之前导出的备份文件，恢复聊天记录" },
      { label: "清除记录", desc: "在聊天设置中可以清除当前会话的聊天记录" },
    ],
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "声明",
    color: "#FF5252",
    sections: [
      { label: "制作者", desc: "抖音 @ovobbit  ·  小红书 @苜蓿🌿（26822731387）" },
      { label: "反馈", desc: "有 bug 可以找我反馈，有空了都会修；有不懂的可以直接来问" },
      { label: "网站性质", desc: "本网站为字卡传讯网站，并非 AI 软件；随机抽字卡，不含 AI" },
      { label: "版权", desc: "网站禁止以任何形式盈利，网站可二传" },
      { label: "", desc: "祝大家玩的开心 ᔦ ° ꒳ ° ᔨ ̖́-" },
    ],
  },
];

export default function StatementApp({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState(0);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(PAGES.length - 1, p + 1));

  // 禁用滑动翻页：避免滑到上一页或卡顿，只保留按钮翻页
  const onTouchStart = () => {};
  const onTouchMove = () => {};
  const onTouchEnd = () => {};

  // 最后一页是声明
  const isLast = page === PAGES.length - 1;
  const isFirst = page === 0;
  const current = PAGES[page];

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="教程" onBack={onBack} />

      {/* 页面指示器（圆点，点击跳转） */}
      <div
        className="flex items-center justify-center gap-1.5 py-2.5 overflow-x-auto fancy-scroll px-2"
        onClickCapture={(e) => e.stopPropagation()}
      >
        {PAGES.map((_, i) => {
          const active = i === page;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                // 不直接 setState 依赖 React 18 批处理
                // 用 setPage 直接赋值，更稳
                setPage(i);
              }}
              className="shrink-0 transition-all duration-200"
              style={{
                width: active ? "14px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: active ? "var(--accent)" : "color-mix(in srgb, var(--text) 20%, transparent)",
              }}
              aria-label={`跳转到第${i + 1}页`}
            />
          );
        })}
      </div>

      {/* 翻页内容区（不用 key={page} 强制重挂载，避免卡顿） */}
      <div
        className="fancy-scroll flex-1 overflow-y-auto px-5 pb-3 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="space-y-4 rounded-2xl p-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
          }}
        >
          {/* 图标 + 标题 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${current.color} 15%, transparent)`,
                color: current.color,
              }}
            >
              {current.icon}
            </div>
            <div className="text-[16px] font-bold" style={{ color: current.color }}>
              {current.title}
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>
              {page + 1} / {PAGES.length}
            </div>
          </div>

          {/* 分隔线 */}
          <div
            className="h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${current.color}40, transparent)`,
            }}
          />

          {/* 功能点列表 */}
          <div className="space-y-3">
            {current.sections.map((s, i) => (
              <div key={i} className="flex gap-3">
                {s.label && (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{
                      background: `color-mix(in srgb, ${current.color} 15%, transparent)`,
                      color: current.color,
                    }}
                  >
                    {i + 1}
                  </div>
                )}
                <div className="flex-1">
                  {s.label && (
                    <div className="text-[13px] font-bold" style={{ color: "var(--text)" }}>
                      {s.label}
                    </div>
                  )}
                  <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-soft)" }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部翻页按钮（不使用表单行为） */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirst}
              className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-[12px] transition select-none"
              style={{
                background: isFirst ? "transparent" : "color-mix(in srgb, var(--accent) 10%, transparent)",
                color: isFirst ? "color-mix(in srgb, var(--text) 20%, transparent)" : "var(--accent)",
                cursor: isFirst ? "default" : "pointer",
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 rounded-xl px-4 py-1.5 text-[12px] font-bold transition select-none"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <Heart className="h-3.5 w-3.5" />
                完成
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-[12px] font-bold transition select-none"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 提示文字 */}
        <div
          className="mt-2 text-center text-[10px] leading-snug"
          style={{ color: "color-mix(in srgb, var(--text) 25%, transparent)" }}
        >
          左右滑动翻页 · 点击上方圆点可直接跳转
        </div>
      </div>
    </div>
  );
}

// 简易 useRef 封装，避免每次 useCallback 重建函数造成闭包旧值
function useCallbackRef<T>(initial: T) {
  // 直接用一个对象 { current } 形式
  // 由于 hook 需要稳定返回，我们用 useState + 不触发 rerender 的写法
  const [box] = useState(() => ({ current: initial }));
  return box;
}
