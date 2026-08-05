import { AppHeader } from "./HomeScreen";

export default function StatementApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="声明" onBack={onBack} />
      <div className="fancy-scroll flex-1 overflow-y-auto px-5 py-5">
        <div
          className="space-y-5 rounded-2xl p-5 text-[13px] leading-loose"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
            color: "var(--text)",
          }}
        >
          <div className="space-y-2">
            <div>本网站由抖音</div>
            <div className="font-bold" style={{ color: "var(--accent)" }}>
              @ovobbit
            </div>
            <div style={{ color: "var(--text-soft)" }}>（xm0919653247）</div>
            <div>小红书</div>
            <div className="font-bold" style={{ color: "var(--accent)" }}>
              @苜蓿🌿
            </div>
            <div style={{ color: "var(--text-soft)" }}>（26822731387）</div>
            <div className="pt-1">制作</div>
          </div>

          <div
            className="rounded-xl px-3 py-2 text-[12px]"
            style={{
              background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              color: "var(--text)",
            }}
          >
            有bug可以找我反馈，有空了都会修
            <br />
            有不懂的可以直接来问我，教程发在抖音了
          </div>

          <div
            className="text-center text-[12px]"
            style={{ color: "var(--text-soft)" }}
          >
            ଘ*⑅┈┈⋆°˖ ┈┈ ୨୧┈┈°⋆┈┈⑅*ଓ
          </div>

          <div className="space-y-2">
            <div className="font-bold">本网站为字卡传讯网站，并非ai软件</div>
            <div>随机抽字卡，不含ai</div>
          </div>

          <div
            className="rounded-xl border-l-4 px-3 py-2 text-[12px]"
            style={{
              borderColor: "var(--accent)",
              background: "color-mix(in srgb, var(--accent) 5%, transparent)",
            }}
          >
            网站禁止以任何形式盈利，网站可二传
          </div>

          <div
            className="text-center text-[12px]"
            style={{ color: "var(--text-soft)" }}
          >
            ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ ⁺ﾟ ☁︎｡₊ ⋆ ☾ ⋆⁺₊⋆ ☁︎⋆｡
          </div>

          <div className="space-y-1.5 text-center">
            <div
              className="font-bold text-[15px]"
              style={{ color: "var(--accent)" }}
            >
              祝大家玩的开心ᔦ ° ꒳ ° ᔨ ̖́-
            </div>
            <div className="text-[12px]" style={{ color: "var(--text-soft)" }}>
              有bug可以多多反馈，或者有什么改进意见也可以提出来!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
