import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Plus, X, Music, Minimize2, Upload } from "lucide-react";
import { useAppStore } from "@/store/app";

interface Props {
  onBack: () => void;
}

export default function MusicApp({ onBack }: Props) {
  const songs = useAppStore((s) => s.songs);
  const addSong = useAppStore((s) => s.addSong);
  const removeSong = useAppStore((s) => s.removeSong);
  const musicPlaying = useAppStore((s) => s.musicPlaying);
  const setMusicPlaying = useAppStore((s) => s.setMusicPlaying);
  const musicCurrentIndex = useAppStore((s) => s.musicCurrentIndex);
  const setMusicCurrentIndex = useAppStore((s) => s.setMusicCurrentIndex);
  const setMusicFloating = useAppStore((s) => s.setMusicFloating);
  const setMusicSwitchNote = useAppStore((s) => s.setMusicSwitchNote);
  const themeId = useAppStore((s) => s.beauty.themeId);
  const isCuteMoe = themeId === "cute-moe";

  const [volume, setVolume] = useState(0.7);
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSong = songs[musicCurrentIndex];

  useEffect(() => {
    if (audioRef.current && currentSong?.url) {
      audioRef.current.src = currentSong.url;
      if (musicPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [musicCurrentIndex, currentSong?.url, musicPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 顺序播放：歌曲结束时自动播放下一首
  const handleEnded = () => {
    if (songs.length === 0) return;

    // 2% 概率对方切歌
    if (Math.random() < 0.02 && songs.length > 1) {
      let newIdx = musicCurrentIndex;
      while (newIdx === musicCurrentIndex) {
        newIdx = Math.floor(Math.random() * songs.length);
      }
      setMusicCurrentIndex(newIdx);
      setMusicPlaying(true);
      setMusicSwitchNote("宝宝，我换一首歌吧，这个好听");
      return;
    }

    // 顺序播放下一首
    const nextIdx = musicCurrentIndex < songs.length - 1 ? musicCurrentIndex + 1 : 0;
    setMusicCurrentIndex(nextIdx);
    setMusicPlaying(true);
  };

  const togglePlay = () => {
    if (!currentSong?.url) return;
    setMusicPlaying(!musicPlaying);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    const prevIdx = musicCurrentIndex > 0 ? musicCurrentIndex - 1 : songs.length - 1;
    setMusicCurrentIndex(prevIdx);
    setMusicPlaying(true);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    const nextIdx = musicCurrentIndex < songs.length - 1 ? musicCurrentIndex + 1 : 0;
    setMusicCurrentIndex(nextIdx);
    setMusicPlaying(true);
  };

  const handleAddSong = () => {
    if (!newUrl.trim() || !newTitle.trim()) return;
    addSong(newTitle.trim(), newUrl.trim());
    setNewUrl("");
    setNewTitle("");
    setShowAddUrl(false);
  };

  const handleImportFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("audio/")) continue;
      const objectUrl = URL.createObjectURL(file);
      // 从文件名提取标题（去掉扩展名）
      const title = file.name.replace(/\.[^/.]+$/, "");
      addSong(title, objectUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowAddUrl(false);
  };

  const handleRemoveSong = (id: string) => {
    removeSong(id);
    if (currentSong?.id === id) {
      setMusicCurrentIndex(0);
      setMusicPlaying(false);
    }
  };

  const handleMinimize = () => {
    setMusicFloating(true);
    onBack();
  };

  return (
    <div className={`flex h-full flex-col ${isCuteMoe ? "cute-music-app" : ""}`}>
      <audio ref={audioRef} onEnded={handleEnded} />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => handleImportFile(e.target.files)}
      />
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: isCuteMoe ? "rgba(212,184,184,0.3)" : "var(--card-border)" }}>
        <button onClick={onBack} className="text-sm" style={{ color: isCuteMoe ? "#8BA8B8" : "var(--text-soft)" }}>返回</button>
        <span className="text-sm font-medium" style={{ color: isCuteMoe ? "#5F7A8C" : "var(--text)" }}>音乐</span>
        <button onClick={handleMinimize} className="flex items-center gap-1 text-xs" style={{ color: isCuteMoe ? "#8BA8B8" : "var(--text-soft)" }}>
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 rounded-3xl p-6 text-center cute-music-cover" style={{
          background: isCuteMoe ? "rgba(255, 230, 235, 0.85)" : "linear-gradient(135deg, var(--accent) 20%, var(--accent) 10%)",
          border: isCuteMoe ? "1px solid rgba(212,184,184,0.35)" : "none",
        }}>
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full mx-auto cute-music-disc" style={{ background: isCuteMoe ? "rgba(255,255,255,0.82)" : "var(--card)" }}>
            <Music className="h-12 w-12" style={{ color: isCuteMoe ? "#E88B8B" : "var(--accent)" }} />
          </div>
          <div className="font-serif text-xl font-bold mb-1" style={{ color: isCuteMoe ? "#5F7A8C" : "var(--card)" }}>
            {currentSong?.title || "暂无歌曲"}
          </div>
          <div className="text-sm opacity-80" style={{ color: isCuteMoe ? "#8BA8B8" : "var(--card)" }}>
            {currentSong?.url ? "已加载" : "请添加音乐链接"}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-4">
          <button
            onClick={prevSong}
            disabled={songs.length === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-black/5 disabled:opacity-40"
            style={{ background: isCuteMoe ? "rgba(255, 230, 235, 0.7)" : "var(--bg)", color: isCuteMoe ? "#5F7A8C" : "var(--text)" }}
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!currentSong?.url}
            className="flex h-16 w-16 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{
              background: isCuteMoe ? "#E88B8B" : "var(--accent)",
              color: "var(--card)",
              boxShadow: isCuteMoe ? "0 4px 15px rgba(232, 139, 139, 0.3)" : "0 4px 15px rgba(199, 62, 58, 0.3)",
            }}
          >
            {musicPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
          </button>
          <button
            onClick={nextSong}
            disabled={songs.length === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-black/5 disabled:opacity-40"
            style={{ background: isCuteMoe ? "rgba(255, 230, 235, 0.7)" : "var(--bg)", color: isCuteMoe ? "#5F7A8C" : "var(--text)" }}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs" style={{ color: isCuteMoe ? "#8BA8B8" : "var(--text-soft)" }}>
            <span>音量</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer cute-music-volume"
            style={{
              background: isCuteMoe ? "rgba(212,184,184,0.25)" : "var(--bg-deep)",
            }}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="font-serif text-sm font-bold" style={{ color: isCuteMoe ? "#5F7A8C" : "var(--text)" }}>
            播放列表
          </div>
          <button
            onClick={() => setShowAddUrl(true)}
            className="flex items-center gap-1 text-xs transition hover:opacity-80"
            style={{ color: isCuteMoe ? "#E88B8B" : "var(--accent)" }}
          >
            <Plus className="h-3 w-3" />
            添加歌曲
          </button>
        </div>

        <div className="space-y-2">
          {songs.length === 0 ? (
            <div className="py-8 text-center text-sm" style={{ color: "var(--text-soft)" }}>
              暂无歌曲，点击右上角添加
            </div>
          ) : (
            songs.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                  index === musicCurrentIndex ? "bg-black/5" : ""
                }`}
                style={{ borderColor: "var(--card-border)" }}
              >
                <button
                  onClick={() => {
                    setMusicCurrentIndex(index);
                    setMusicPlaying(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-black/5"
                  style={{ background: "var(--bg)" }}
                >
                  {index === musicCurrentIndex && musicPlaying ? (
                    <Pause className="h-4 w-4" style={{ color: "var(--accent)" }} />
                  ) : (
                    <Play className="h-4 w-4" style={{ color: "var(--text-soft)" }} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate" style={{ color: "var(--text)" }}>
                    {song.title}
                  </div>
                  <div className="text-xs truncate opacity-60" style={{ color: "var(--text-soft)" }}>
                    {song.url.startsWith("blob:") ? "本地文件" : song.url.startsWith("data:") ? "本地文件" : song.url.substring(0, 30) + (song.url.length > 30 ? "..." : "")}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSong(song.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-red-50"
                  style={{ color: "#E74C3C" }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-[85%] max-w-sm rounded-2xl border p-4"
            style={{
              borderColor: "var(--card-border)",
              background: "var(--card)",
            }}
          >
            <div className="mb-4 font-serif text-lg font-bold" style={{ color: "var(--text)" }}>
              添加歌曲
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs" style={{ color: "var(--text-soft)" }}>
                  歌曲名称
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入名称..."
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs" style={{ color: "var(--text-soft)" }}>
                  音乐 URL
                </label>
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
                <span className="text-[10px]" style={{ color: "var(--text-soft)" }}>或</span>
                <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-2.5 text-sm transition hover:bg-black/5"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--accent)",
                }}
              >
                <Upload className="h-4 w-4" />
                导入本地音乐文件
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddUrl(false)}
                  className="flex-1 rounded-xl py-2 text-sm transition hover:bg-black/5"
                  style={{ background: "var(--bg)", color: "var(--text)" }}
                >
                  取消
                </button>
                <button
                  onClick={handleAddSong}
                  disabled={!newUrl.trim() || !newTitle.trim()}
                  className="flex-1 rounded-xl py-2 text-sm font-medium transition disabled:opacity-40"
                  style={{
                    background: "var(--accent)",
                    color: "var(--card)",
                  }}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
