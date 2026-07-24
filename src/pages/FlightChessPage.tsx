import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Dices } from "lucide-react";
import { useAppStore } from "@/store/app";
import type { Contact } from "@/types";

type PlayerColor = "red" | "yellow" | "green" | "blue";

const PLAYER_ORDER: PlayerColor[] = ["red", "yellow", "green", "blue"];
const COLORS: Record<PlayerColor, { bg: string; border: string; text: string }> = {
  red: { bg: "#ff6b6b", border: "#ee5a5a", text: "#fff" },
  yellow: { bg: "#ffd93d", border: "#f5c800", text: "#333" },
  green: { bg: "#6bcb77", border: "#5ab665", text: "#fff" },
  blue: { bg: "#4d96ff", border: "#3d85ee", text: "#fff" },
};

const TOTAL_TRACK = 52;

// 地图总尺寸：28x16（适合手机横屏）
const MAP_WIDTH = 28;
const MAP_HEIGHT = 16;

// 共享的 52 格轨道坐标
const TRACK_POSITIONS: { x: number; y: number }[] = (() => {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < 13; i++) positions.push({ x: 3 + i, y: 1 });
  for (let i = 0; i < 13; i++) positions.push({ x: 25, y: 2 + i });
  for (let i = 0; i < 13; i++) positions.push({ x: 24 - i, y: 15 });
  for (let i = 0; i < 13; i++) positions.push({ x: 2, y: 14 - i });
  return positions;
})();

interface Plane {
  id: string;
  color: PlayerColor;
  position: number;
  inBase: boolean;
  finished: boolean;
}

interface GameState {
  planes: Plane[];
  currentPlayer: PlayerColor;
  dice: number | null;
  isRolling: boolean;
  selectedPlaneId: string | null;
  message: string;
  lastCard: string | null;
  showCard: boolean;
  turnCount: number;
}

export default function FlightChessPage() {
  const navigate = useNavigate();
  const contacts = useAppStore((s) => s.contacts);
  const conversations = useAppStore((s) => s.conversations);
  const myAvatar = useAppStore((s) => s.beauty.myAvatar);
  const myAvatarImage = useAppStore((s) => s.beauty.myAvatarImage);
  const herAvatarImage = useAppStore((s) => s.beauty.herAvatarImage);
  const pickRandomCard = useAppStore((s) => s.pickRandomCard);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const goHome = useCallback(() => {
    sessionStorage.removeItem("flight-chess-entered");
    try {
      navigate("/");
    } catch {
      /* ignore */
    }
    // 双重保险：确保 hash 一定回到主页
    window.location.hash = "#/";
    setTimeout(() => {
      if (window.location.hash !== "#/" && window.location.hash !== "") {
        window.location.href = window.location.origin + window.location.pathname + window.location.search + "#/";
      }
    }, 80);
  }, [navigate]);

  // 入口守卫：只有从手机端“开始游戏”按钮进入才允许停留，否则直接回主页
  // 解决浏览器记住 #/flight-chess 导致一进来就是飞行棋的问题
  useEffect(() => {
    const entered = sessionStorage.getItem("flight-chess-entered");
    if (!entered) {
      window.location.hash = "#/";
    }
  }, []);

  const getPlayerInfo = useCallback((color: PlayerColor): { name: string; avatarImage: string; avatarText: string; contactId?: string } => {
    const idx = PLAYER_ORDER.indexOf(color);
    if (idx === 0) {
      return { name: myAvatar, avatarImage: myAvatarImage, avatarText: myAvatar };
    }
    const contactIdx = idx - 1;
    if (selectedContacts[contactIdx]) {
      const c = contacts.find((x) => x.id === selectedContacts[contactIdx]);
      if (c) {
        const conv = conversations.find((cv) => cv.type === "private" && cv.memberIds.includes(c.id));
        const avatarImage = conv?.herAvatarImage || c.avatarImage || herAvatarImage || "";
        const avatarText = conv?.herAvatarText || c.avatar || c.name.charAt(0);
        return { name: c.name, avatarImage, avatarText, contactId: c.id };
      }
    }
    const names = ["宝宝", "宝", "受气包"];
    const name = names[contactIdx] || `玩家${idx}`;
    return { name, avatarImage: herAvatarImage || "", avatarText: name.charAt(0) };
  }, [contacts, conversations, myAvatar, myAvatarImage, herAvatarImage, selectedContacts]);

  const getChatCardsForPlayer = useCallback((color: PlayerColor) => {
    const info = getPlayerInfo(color);
    if (info.contactId) {
      const c = contacts.find((x) => x.id === info.contactId);
      if (c && c.cards?.chat) {
        return c.cards.chat;
      }
    }
    return [];
  }, [contacts, getPlayerInfo]);

  const initGame = useCallback(() => {
    const planes: Plane[] = [];
    PLAYER_ORDER.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        planes.push({ id: `${color}-${i}`, color, position: -1, inBase: true, finished: false });
      }
    });
    setGameState({
      planes,
      currentPlayer: "red",
      dice: null,
      isRolling: false,
      selectedPlaneId: null,
      message: "游戏开始！",
      lastCard: null,
      showCard: false,
      turnCount: 0,
    });
  }, []);

  const isMyTurn = gameState?.currentPlayer === "red";

  const getMovablePlaneIds = useCallback((): string[] => {
    if (!gameState || !gameState.dice || !isMyTurn) return [];
    const movable: string[] = [];
    const { dice, planes, currentPlayer } = gameState;
    const colorOrder = PLAYER_ORDER.indexOf(currentPlayer);
    const startPos = (colorOrder * 13) % TOTAL_TRACK;
    
    planes.forEach((plane) => {
      if (plane.color !== currentPlayer || plane.finished) return;
      
      if (plane.inBase) {
        if (dice === 6) movable.push(plane.id);
        return;
      }
      
      const newPos = plane.position + dice;
      if (newPos <= TOTAL_TRACK + startPos + 3) {
        movable.push(plane.id);
      }
    });
    
    return movable;
  }, [gameState, isMyTurn]);

  const rollDice = useCallback(() => {
    if (!gameState || !isMyTurn || gameState.isRolling || gameState.dice !== null) return;
    
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, isRolling: true };
    });
    
    setTimeout(() => {
      const finalDice = Math.floor(Math.random() * 6) + 1;
      
      let cardText: string | null = null;
      if (finalDice === 6 || finalDice === 1) {
        const cards = getChatCardsForPlayer(gameState.currentPlayer);
        if (cards.length > 0) {
          cardText = cards[Math.floor(Math.random() * cards.length)].content;
        }
      }
      
      const playerInfo = getPlayerInfo(gameState.currentPlayer);
      const message = cardText 
        ? `${playerInfo.name}: ${cardText}` 
        : `${playerInfo.name} 投出了 ${finalDice} 点`;
      
      setGameState((prev) => {
        if (!prev) return prev;
        
        const colorOrder = PLAYER_ORDER.indexOf(prev.currentPlayer);
        const startPos = (colorOrder * 13) % TOTAL_TRACK;
        
        const movablePlanes = prev.planes.filter((p) => {
          if (p.color !== prev.currentPlayer || p.finished) return false;
          if (p.inBase) return finalDice === 6;
          return p.position + finalDice <= TOTAL_TRACK + startPos + 3;
        });
        
        if (!isMyTurn && movablePlanes.length > 0) {
          setTimeout(() => {
            const randomPlane = movablePlanes[Math.floor(Math.random() * movablePlanes.length)];
            movePlane(randomPlane.id);
          }, 800);
        }
        
        return {
          ...prev,
          dice: finalDice,
          isRolling: false,
          selectedPlaneId: null,
          message,
          lastCard: cardText,
          showCard: !!cardText,
          turnCount: prev.turnCount + 1,
        };
      });
      
      setTimeout(() => {
        setGameState((prev) => {
          if (!prev) return prev;
          return { ...prev, showCard: false };
        });
      }, 3000);
      
    }, 600);
  }, [gameState, isMyTurn, getChatCardsForPlayer, getPlayerInfo]);

  const movePlane = useCallback((planeId: string) => {
    if (!gameState || !gameState.dice) return;
    
    setGameState((prev) => {
      if (!prev || !prev.dice) return prev;
      
      const planes = prev.planes.map((p) => {
        if (p.id !== planeId) return p;
        const colorOrder = PLAYER_ORDER.indexOf(p.color);
        const startPos = (colorOrder * 13) % TOTAL_TRACK;
        
        if (p.inBase) {
          return { ...p, inBase: false, position: startPos };
        }
        
        const newPos = p.position + prev.dice;
        
        if (newPos > TOTAL_TRACK + startPos) {
          const overshoot = newPos - (TOTAL_TRACK + startPos);
          if (overshoot > 4) return p;
          const finishIdx = overshoot - 1;
          return { ...p, position: TOTAL_TRACK + finishIdx, finished: overshoot === 4 };
        }
        
        const targetPos = newPos % TOTAL_TRACK;
        
        const otherPlane = prev.planes.find(
          (op) => op.id !== planeId && op.color !== p.color && op.position === targetPos && !op.finished && !op.inBase
        );
        
        if (otherPlane) {
          return { ...otherPlane, position: -1, inBase: true };
        }
        
        return { ...p, position: targetPos };
      });
      
      const currentPlayerIdx = PLAYER_ORDER.indexOf(prev.currentPlayer);
      let nextPlayerIdx = currentPlayerIdx;
      
      if (prev.dice !== 6) {
        nextPlayerIdx = (currentPlayerIdx + 1) % 4;
      }
      
      const winner = PLAYER_ORDER.find((color) => {
        return planes.filter((p) => p.color === color && p.finished).length === 4;
      });
      
      const message = winner 
        ? `${getPlayerInfo(winner).name} 获胜！` 
        : prev.dice === 6
        ? `${getPlayerInfo(prev.currentPlayer).name} 再投一次！`
        : `${getPlayerInfo(PLAYER_ORDER[nextPlayerIdx]).name} 的回合`;
      
      return {
        ...prev,
        planes,
        currentPlayer: winner ? prev.currentPlayer : PLAYER_ORDER[nextPlayerIdx],
        dice: null,
        selectedPlaneId: null,
        message,
      };
    });
    
    setTimeout(() => {
      setGameState((prev) => {
        if (!prev || prev.currentPlayer === "red") return prev;
        
        setGameState((p) => {
          if (!p || p.currentPlayer === "red") return p;
          return { ...p, isRolling: true };
        });
        
        setTimeout(() => {
          setGameState((p) => {
            if (!p || p.currentPlayer === "red") return p;
            
            const finalDice = Math.floor(Math.random() * 6) + 1;
            
            let cardText: string | null = null;
            if (finalDice === 6 || finalDice === 1) {
              const cards = getChatCardsForPlayer(p.currentPlayer);
              if (cards.length > 0) {
                cardText = cards[Math.floor(Math.random() * cards.length)].content;
              }
            }
            
            const playerInfo = getPlayerInfo(p.currentPlayer);
            const message = cardText 
              ? `${playerInfo.name}: ${cardText}` 
              : `${playerInfo.name} 投出了 ${finalDice} 点`;
            
            const colorOrder = PLAYER_ORDER.indexOf(p.currentPlayer);
            const startPos = (colorOrder * 13) % TOTAL_TRACK;
            
            const movablePlanes = p.planes.filter((pp) => {
              if (pp.color !== p.currentPlayer || pp.finished) return false;
              if (pp.inBase) return finalDice === 6;
              return pp.position + finalDice <= TOTAL_TRACK + startPos + 3;
            });
            
            if (movablePlanes.length > 0) {
              setTimeout(() => {
                const randomPlane = movablePlanes[Math.floor(Math.random() * movablePlanes.length)];
                movePlane(randomPlane.id);
              }, 800);
            } else {
              setTimeout(() => {
                setGameState((prevState) => {
                  if (!prevState || prevState.currentPlayer === "red") return prevState;
                  const idx = PLAYER_ORDER.indexOf(prevState.currentPlayer);
                  const nextIdx = (idx + 1) % 4;
                  return {
                    ...prevState,
                    currentPlayer: PLAYER_ORDER[nextIdx],
                    dice: null,
                    message: `${getPlayerInfo(PLAYER_ORDER[nextIdx]).name} 的回合`,
                  };
                });
              }, 500);
            }
            
            return {
              ...p,
              dice: finalDice,
              isRolling: false,
              selectedPlaneId: null,
              message,
              lastCard: cardText,
              showCard: !!cardText,
              turnCount: p.turnCount + 1,
            };
          });
          
          setTimeout(() => {
            setGameState((p) => {
              if (!p) return p;
              return { ...p, showCard: false };
            });
          }, 3000);
        }, 600);
        
        return prev;
      });
    }, 600);
  }, [gameState, getPlayerInfo, getChatCardsForPlayer]);

  const getPlanePosition = (plane: Plane) => {
    if (plane.inBase) {
      const colorIdx = PLAYER_ORDER.indexOf(plane.color);
      const basePositions = [
        { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 },
        { x: 25, y: 1 }, { x: 26, y: 1 }, { x: 25, y: 2 }, { x: 26, y: 2 },
        { x: 25, y: 13 }, { x: 26, y: 13 }, { x: 25, y: 14 }, { x: 26, y: 14 },
        { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 1, y: 14 }, { x: 2, y: 14 },
      ];
      const idx = PLAYER_ORDER.indexOf(plane.color) * 4 + parseInt(plane.id.split("-")[1]);
      return basePositions[idx];
    }
    
    if (plane.position >= TOTAL_TRACK) {
      const finishIdx = plane.position - TOTAL_TRACK;
      const colorIdx = PLAYER_ORDER.indexOf(plane.color);
      const finishPositions = [
        [{ x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }],
        [{ x: 19, y: 6 }, { x: 18, y: 6 }, { x: 17, y: 6 }, { x: 16, y: 6 }],
        [{ x: 16, y: 10 }, { x: 16, y: 9 }, { x: 16, y: 8 }, { x: 16, y: 7 }],
        [{ x: 10, y: 7 }, { x: 11, y: 7 }, { x: 12, y: 7 }, { x: 13, y: 7 }],
      ];
      return finishPositions[colorIdx][finishIdx];
    }
    
    if (plane.position < 0 || plane.position >= TRACK_POSITIONS.length) {
      return { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
    }
    return TRACK_POSITIONS[plane.position];
  };

  const renderBoard = () => {
    if (!gameState) return null;
    
    const movablePlaneIds = getMovablePlaneIds();
    
    return (
      <div ref={boardRef} className="relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-3 shadow-xl overflow-hidden" style={{ width: "100%", aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
        <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.08" fill="rgba(0,0,0,0.05)" />
            </pattern>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.2" stdDeviation="0.3" floodOpacity="0.2" />
            </filter>
          </defs>
          
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />
          
          <rect x="0" y="0" width="3" height="3" fill="#ff6b6b" opacity="0.15" rx="0.3" />
          <rect x="0" y="0" width="3" height="3" fill="none" stroke="#ff6b6b" strokeWidth="0.15" rx="0.3" />
          <text x="1.5" y="1.8" fontSize="0.6" fill="#ff6b6b" textAnchor="middle" fontWeight="bold">基地</text>
          
          <rect x="25" y="0" width="3" height="3" fill="#ffd93d" opacity="0.15" rx="0.3" />
          <rect x="25" y="0" width="3" height="3" fill="none" stroke="#ffd93d" strokeWidth="0.15" rx="0.3" />
          <text x="26.5" y="1.8" fontSize="0.6" fill="#ffd93d" textAnchor="middle" fontWeight="bold">基地</text>
          
          <rect x="25" y="13" width="3" height="3" fill="#6bcb77" opacity="0.15" rx="0.3" />
          <rect x="25" y="13" width="3" height="3" fill="none" stroke="#6bcb77" strokeWidth="0.15" rx="0.3" />
          <text x="26.5" y="14.8" fontSize="0.6" fill="#6bcb77" textAnchor="middle" fontWeight="bold">基地</text>
          
          <rect x="0" y="13" width="3" height="3" fill="#4d96ff" opacity="0.15" rx="0.3" />
          <rect x="0" y="13" width="3" height="3" fill="none" stroke="#4d96ff" strokeWidth="0.15" rx="0.3" />
          <text x="1.5" y="14.8" fontSize="0.6" fill="#4d96ff" textAnchor="middle" fontWeight="bold">基地</text>
          
          <circle cx={MAP_WIDTH / 2} cy={MAP_HEIGHT / 2} r="5" fill="none" stroke="#ddd" strokeWidth="0.1" />
          <circle cx={MAP_WIDTH / 2} cy={MAP_HEIGHT / 2} r="4" fill="none" stroke="#ddd" strokeWidth="0.1" />
          
          {PLAYER_ORDER.map((color, idx) => {
            const angle = (idx * 90 - 45) * (Math.PI / 180);
            const startAngle = idx * 90 * (Math.PI / 180);
            const endAngle = (idx + 1) * 90 * (Math.PI / 180);
            const cx = MAP_WIDTH / 2;
            const cy = MAP_HEIGHT / 2;
            return (
              <g key={color}>
                <path
                  d={`M ${cx} ${cy} L ${cx + 4 * Math.cos(startAngle)} ${cy + 4 * Math.sin(startAngle)} A 4 4 0 0 1 ${cx + 4 * Math.cos(endAngle)} ${cy + 4 * Math.sin(endAngle)} Z`}
                  fill={COLORS[color].bg}
                  opacity="0.2"
                />
                <text
                  x={cx + 2.5 * Math.cos(angle)}
                  y={cy + 2.5 * Math.sin(angle)}
                  fontSize="0.5"
                  fill={COLORS[color].text}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ✈
                </text>
              </g>
            );
          })}
          
          {TRACK_POSITIONS.map((coord, i) => {
            const { x, y } = coord;
            const colorIdx = Math.floor(i / 13);
            const color = PLAYER_ORDER[colorIdx];
            const isStart = i % 13 === 0;

            return (
              <g key={i}>
                <rect
                  x={x - 0.45}
                  y={y - 0.45}
                  width="0.9"
                  height="0.9"
                  fill={COLORS[color].bg}
                  opacity={isStart ? 0.5 : 0.3}
                  rx="0.2"
                  filter="url(#shadow)"
                />
                {isStart && (
                  <text
                    x={x}
                    y={y + 0.15}
                    fontSize="0.4"
                    fill={COLORS[color].text}
                    textAnchor="middle"
                  >
                    🛫
                  </text>
                )}
              </g>
            );
          })}
          
          {PLAYER_ORDER.map((color, idx) => {
            const finishPositions = [
              [{ x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }],
              [{ x: 19, y: 6 }, { x: 18, y: 6 }, { x: 17, y: 6 }, { x: 16, y: 6 }],
              [{ x: 16, y: 10 }, { x: 16, y: 9 }, { x: 16, y: 8 }, { x: 16, y: 7 }],
              [{ x: 10, y: 7 }, { x: 11, y: 7 }, { x: 12, y: 7 }, { x: 13, y: 7 }],
            ];
            return finishPositions[idx].map((pos, fi) => (
              <rect
                key={`${color}-finish-${fi}`}
                x={pos.x - 0.4}
                y={pos.y - 0.4}
                width="0.8"
                height="0.8"
                fill={COLORS[color].bg}
                opacity={0.4}
                rx="0.2"
              >
                {fi === 3 && (
                  <text
                    x={pos.x}
                    y={pos.y + 0.15}
                    fontSize="0.35"
                    fill={COLORS[color].text}
                    textAnchor="middle"
                  >
                    ⭐
                  </text>
                )}
              </rect>
            ));
          })}
        </svg>
        
        {gameState.planes.map((plane) => {
          const pos = getPlanePosition(plane);
          const isMovable = movablePlaneIds.includes(plane.id);
          const isSelected = gameState.selectedPlaneId === plane.id;
          const info = getPlayerInfo(plane.color);
          
          return (
            <div
              key={plane.id}
              className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${isMovable ? "hover:scale-110" : ""} ${isSelected ? "ring-2 ring-white ring-offset-2" : ""}`}
              style={{
                left: `${((pos.x - 0.5) / MAP_WIDTH) * 100}%`,
                top: `${((pos.y - 0.5) / MAP_HEIGHT) * 100}%`,
                width: "24px",
                height: "24px",
                backgroundColor: COLORS[plane.color].bg,
                boxShadow: `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)`,
                border: `2px solid ${COLORS[plane.color].border}`,
                transform: isMovable ? "scale(1.1)" : "scale(1)",
                zIndex: isSelected ? 10 : 1,
              }}
              onClick={() => {
                if (isMovable) {
                  movePlane(plane.id);
                }
              }}
            >
              {info.avatarImage ? (
                <img src={info.avatarImage} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xs font-bold" style={{ color: COLORS[plane.color].text }}>
                  {info.avatarText}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            ✈️ 飞行棋
          </h1>
          
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">选择对手</h2>
            <div className="space-y-2">
              {contacts.slice(0, 3).map((contact) => {
                const conv = conversations.find((cv) => cv.type === "private" && cv.memberIds.includes(contact.id));
                const avatarImg = conv?.herAvatarImage || contact.avatarImage || herAvatarImage || "";
                const avatarTxt = conv?.herAvatarText || contact.avatar || contact.name.charAt(0);
                return (
                <label
                  key={contact.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedContacts.includes(contact.id)
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (selectedContacts.length < 3) {
                          setSelectedContacts([...selectedContacts, contact.id]);
                        }
                      } else {
                        setSelectedContacts(selectedContacts.filter((id) => id !== contact.id));
                      }
                    }}
                    className="w-5 h-5 rounded accent-purple-500"
                  />
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
                    style={{
                      backgroundColor: avatarImg ? "transparent" : "#e5e7eb",
                    }}
                  >
                    {avatarImg ? (
                      <img src={avatarImg} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      avatarTxt
                    )}
                  </div>
                  <span className="font-medium">{contact.name}</span>
                </label>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={initGame}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            disabled={selectedContacts.length === 0}
          >
            开始游戏
          </button>
          
          <button
            onClick={() => goHome()}
            className="w-full py-3 mt-3 text-gray-500 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-2">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-3 shadow-2xl w-full" style={{ maxWidth: "750px", maxHeight: "95vh", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => goHome()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            ✈️ 飞行棋
          </h1>
          <button
            onClick={initGame}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-3">
          {gameState.showCard && gameState.lastCard && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-xl p-3 mb-2 animate-pulse">
              <p className="text-center font-medium text-gray-700 text-sm">{gameState.lastCard}</p>
            </div>
          )}
          <p className="text-center text-gray-600 text-xs">{gameState.message}</p>
        </div>
        
        {renderBoard()}
        
        <div className="mt-3 grid grid-cols-4 gap-2">
          {PLAYER_ORDER.map((color) => {
            const info = getPlayerInfo(color);
            const isCurrent = gameState.currentPlayer === color;
            const finishedCount = gameState.planes.filter((p) => p.color === color && p.finished).length;
            
            return (
              <div
                key={color}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isCurrent ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  backgroundColor: isCurrent ? COLORS[color].bg : "#f3f4f6",
                  color: isCurrent ? COLORS[color].text : "#374151",
                  "--tw-ring-color": COLORS[color].bg,
                } as React.CSSProperties}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: COLORS[color].bg }}
                >
                  {info.avatarImage ? (
                    <img src={info.avatarImage} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span style={{ color: COLORS[color].text }}>{info.avatarText}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium truncate max-w-[60px]">{info.name}</p>
                  <p className="text-[10px] opacity-70">{finishedCount}/4</p>
                </div>
                {isCurrent && (
                  <span className="text-[10px] font-bold">👑</span>
                )}
                </div>
              );
            })}
          </div>
        
        <div className="mt-3 flex flex-col items-center gap-2">
          {gameState.dice !== null && (
            <div className="flex items-center gap-2 text-base font-bold">
              <Dices className="w-5 h-5" />
              <span>{gameState.dice} 点</span>
            </div>
          )}
          
          <button
            onClick={rollDice}
            disabled={!isMyTurn || gameState.isRolling || gameState.dice !== null}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white transition-all ${
              isMyTurn && !gameState.isRolling && gameState.dice === null
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <Dices className={`w-4 h-4 ${gameState.isRolling ? "animate-spin" : ""}`} />
            {gameState.isRolling ? "投掷中..." : isMyTurn ? "投骰子" : "对方回合"}
          </button>
        </div>
      </div>
    </div>
  );
}