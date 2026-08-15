import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Music, ListMusic, Volume2, Sparkles } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  color: string;
}

const PLAYLIST: Song[] = [
  { id: 1, title: 'Starry Synthwave', artist: 'Neon Horizons', album: 'Cyber Midnight', duration: 215, color: 'from-amber-500 to-rose-600' },
  { id: 2, title: 'Electric Reverie', artist: 'Aura Pulse', album: 'Luminous', duration: 184, color: 'from-purple-600 to-indigo-700' },
  { id: 3, title: 'Cascade Dreams', artist: 'Solaris', album: 'Cosmic Echoes', duration: 240, color: 'from-cyan-500 to-blue-600' },
  { id: 4, title: 'Velvet Groove', artist: 'The Midnight Trio', album: 'Lo-Fi Chill', duration: 198, color: 'from-emerald-500 to-teal-700' }
];

export const MusicApp: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(42);
  const [isLiked, setIsLiked] = useState(true);
  const [activeTab, setActiveTab] = useState<'player' | 'playlist'>('player');

  const currentSong = PLAYLIST[currentSongIndex];

  // Track progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentSong.duration) {
            setCurrentSongIndex((currentSongIndex + 1) % PLAYLIST.length);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSongIndex, currentSong.duration]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12">
      {/* App Top Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur sticky top-0 z-10 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-purple-300">Harmonix Audio</span>
        </div>
        <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3 py-1 rounded-lg transition ${activeTab === 'player' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'}`}
          >
            Player
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`px-3 py-1 rounded-lg transition ${activeTab === 'playlist' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'}`}
          >
            Playlist
          </button>
        </div>
      </div>

      {activeTab === 'player' ? (
        <div className="p-5 flex flex-col items-center justify-between flex-1 space-y-6">
          {/* Dynamic Album Art with Glow */}
          <div className="relative mt-2">
            <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-r ${currentSong.color} blur-2xl opacity-40 animate-pulse`}></div>
            <div className={`w-56 h-56 rounded-3xl bg-gradient-to-tr ${currentSong.color} p-6 shadow-2xl relative flex flex-col justify-between border border-white/20`}>
              <div className="flex justify-between items-start text-white/80">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-full backdrop-blur">Hi-Res Audio</span>
              </div>
              <div className="text-white">
                <p className="text-xs text-white/70 font-semibold">{currentSong.album}</p>
                <p className="text-xl font-extrabold leading-tight">{currentSong.title}</p>
              </div>
            </div>
          </div>

          {/* Equalizer Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, Math.round(h * Math.random()))}%` : '20%'
                }}
              ></div>
            ))}
          </div>

          {/* Track Info & Like Button */}
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{currentSong.title}</h2>
              <p className="text-sm text-purple-300/80">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-2xl border transition ${isLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Seek Bar */}
          <div className="w-full space-y-1.5">
            <input
              type="range"
              min={0}
              max={currentSong.duration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full flex items-center justify-evenly py-2">
            <button
              onClick={() => {
                setCurrentSongIndex((currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
                setCurrentTime(0);
              }}
              className="p-3 text-slate-300 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-90 transition"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>

            <button
              onClick={() => {
                setCurrentSongIndex((currentSongIndex + 1) % PLAYLIST.length);
                setCurrentTime(0);
              }}
              className="p-3 text-slate-300 hover:text-white rounded-full bg-slate-900 border border-slate-800 active:scale-90 transition"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* Playlist View */
        <div className="p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-2">
            <ListMusic className="w-4 h-4" /> Up Next Playlist
          </div>
          {PLAYLIST.map((song, idx) => {
            const isSelected = idx === currentSongIndex;
            return (
              <div
                key={song.id}
                onClick={() => {
                  setCurrentSongIndex(idx);
                  setCurrentTime(0);
                  setIsPlaying(true);
                  setActiveTab('player');
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected ? 'bg-purple-950/60 border-purple-500/50 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${song.color} flex items-center justify-center text-white font-bold text-xs`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{song.title}</div>
                    <div className="text-xs text-slate-400">{song.artist}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">{formatTime(song.duration)}</span>
                  {isSelected && <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
