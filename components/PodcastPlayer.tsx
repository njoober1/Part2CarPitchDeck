import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PodcastPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  audioSrc: string;
  title: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ isOpen, onClose, audioSrc, title }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const animationRef = useRef<number>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const onLoadedMetadata = () => {
    if (audioRef.current) {
        const audioDuration = audioRef.current.duration;
        if (isFinite(audioDuration)) {
          setDuration(audioDuration);
          if (progressBarRef.current) {
            progressBarRef.current.max = String(audioDuration);
          }
        }
        setIsReady(true);
    }
  };
  
  const whilePlaying = useCallback(() => {
    if (audioRef.current && progressBarRef.current) {
      progressBarRef.current.value = String(audioRef.current.currentTime);
      setCurrentTime(audioRef.current.currentTime);
      progressBarRef.current.style.setProperty('--seek-before-width', `${(audioRef.current.currentTime / duration) * 100}%`)
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [duration]);

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(error => console.error("Error playing audio:", error));
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioRef.current?.pause();
      if(animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, whilePlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);


  const togglePlayPause = () => {
    if (isReady) {
        setIsPlaying(prev => !prev);
    }
  };
  
  const changeRange = () => {
    if (audioRef.current && progressBarRef.current) {
      audioRef.current.currentTime = Number(progressBarRef.current.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const skipTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += time;
       if(progressBarRef.current) {
         progressBarRef.current.value = String(audioRef.current.currentTime);
      }
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
        setIsMuted(false);
    } else {
        setIsMuted(true);
    }
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (isMuted) {
      setVolume(lastVolume > 0 ? lastVolume : 0.5); // Restore to last volume or a default
    } else {
      setLastVolume(volume);
      setVolume(0);
    }
  };

  const VolumeIcon = () => {
      if (isMuted || volume === 0) {
          return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l-4-4m0 4l4-4" />
              </svg>
          );
      }
      if (volume < 0.5) {
          return (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
          );
      }
      return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
      );
  };
  
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] no-print" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="podcast-title"
    >
      <style>{`
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #517AE5; cursor: pointer; margin-top: -6px; transition: background 0.2s ease-in-out, transform 0.2s ease-in-out; }
        input[type="range"]:hover::-webkit-slider-thumb { background: #6b8ef3; transform: scale(1.1); }
        input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #517AE5; cursor: pointer; border: none; transition: background 0.2s ease-in-out, transform 0.2s ease-in-out; }
        input[type="range"]:hover::-moz-range-thumb { background: #6b8ef3; transform: scale(1.1); }
        input[type="range"].progress-bar { --seek-before-width: ${currentTime / duration * 100}%; background: linear-gradient(to right, #517AE5 var(--seek-before-width), #475569 calc(var(--seek-before-width) + 0.1%)); }
        input[type="range"].volume-bar { --volume-before-width: ${isMuted ? '0%' : `${volume * 100}%`}; background: linear-gradient(to right, #93adf5 var(--volume-before-width), #475569 calc(var(--volume-before-width) + 0.1%)); }
      `}</style>
      <div 
        className="glassmorphism rounded-xl p-6 sm:p-8 max-w-md w-full m-4 animate-fade-in-up flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm">Now Playing</p>
                <h3 id="podcast-title" className="text-xl font-bold text-white leading-tight">Part2Car.ae: AI-Powered Disruption</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none -mt-1">&times;</button>
        </div>

        <audio ref={audioRef} src={audioSrc} preload="metadata" onLoadedMetadata={onLoadedMetadata} onEnded={() => setIsPlaying(false)} />

        <div>
            <input 
                type="range"
                ref={progressBarRef}
                defaultValue="0"
                step="0.01"
                onChange={changeRange}
                className="w-full h-1.5 rounded-lg outline-none cursor-pointer progress-bar appearance-none"
                disabled={!isReady}
                aria-label="Audio progress"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6">
            <button onClick={() => skipTime(-10)} className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Rewind 10 seconds" disabled={!isReady}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </button>

            <button onClick={togglePlayPause} className="w-20 h-20 rounded-full flex items-center justify-center bg-[#517AE5] hover:bg-[#4367c6] transition-all text-white shadow-lg shadow-[#517AE5]/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={isPlaying ? 'Pause' : 'Play'} disabled={!isReady}>
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path d="M5 6a2 2 0 012-2h1a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6zm7-2a2 2 0 00-2 2v8a2 2 0 002 2h1a2 2 0 002-2V6a2 2 0 00-2-2h-1z"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/></svg>
                )}
            </button>
            
            <button onClick={() => skipTime(10)} className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Fast-forward 10 seconds" disabled={!isReady}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                </svg>
            </button>
        </div>
        
        <div className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto pt-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}><VolumeIcon /></button>
            <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 rounded-lg outline-none cursor-pointer appearance-none volume-bar"
                aria-label="Volume"
            />
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;