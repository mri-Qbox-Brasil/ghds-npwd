import React, { useEffect, useRef, useState } from 'react';
import { CircleDot, X, Square, Play, Pause, Send, Mic } from 'lucide-react';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAudioMessageAPI } from '@apps/messages/hooks/useAudioMessageAPI';
import { cn } from '@utils/cn';

dayjs.extend(duration);

interface AudioContextMenuProps {
  onClose: () => void;
}

const AudioContextMenu: React.FC<AudioContextMenuProps> = ({ onClose }) => {
  const {
    blob,
    audio: recordedAudio,
    recordingState,
    startRecording,
    stopRecording,
  } = useRecorder();
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const { uploadRecording } = useAudioMessageAPI();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  const audioRef = useRef(new Audio());
  const durationValue = audioRef.current.duration;

  useEffect(() => {
    audioRef.current.src = recordedAudio;
  }, [recordedAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(Math.trunc(audioRef.current.currentTime));
      };
      audioRef.current.onended = () => setPlaying(false);
    }
  });

  const play = async () => {
    await audioRef.current.play();
    setPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  const handleStartRecord = async () => {
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSendRecording = async () => {
    try {
      if (!blob) return;
      setIsSending(true);
      await uploadRecording(blob, onClose);
    } catch (err) {
      setIsSending(false);
      console.error(err);
    }
  };

  if (isSending) {
    return (
      <div className="flex h-14 w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl border border-blue-500/20 shadow-inner px-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-bold text-blue-500 italic uppercase">Enviando áudio...</span>
        </div>
      </div>
    );
  }

  const isRecording = recordingState.isRecording;

  return (
    <div className="flex items-center justify-between w-full h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-3 gap-3 shadow-inner border border-transparent focus-within:border-blue-500/30 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2">
        {recordedAudio && !isRecording ? (
          <button
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500 text-white shadow-md active:scale-90 transition-all"
            onClick={playing ? pause : play}
          >
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500 text-white shadow-md active:scale-90 transition-all hover:bg-red-600"
                onClick={handleStartRecord}
              >
                <Mic size={20} />
              </button>
            ) : (
              <button
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md active:scale-90 transition-all animate-pulse"
                onClick={handleStopRecording}
              >
                <Square size={20} fill="currentColor" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {!recordedAudio && !isRecording ? (
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Toque para gravar</span>
        ) : isRecording ? (
          <div className="flex flex-col items-center">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 italic animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Gravando áudio
            </span>
            <span className="text-xs font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
              {dayjs.duration(recordingState.duration, 'seconds').format('mm:ss')}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-tighter italic">Revisar áudio</span>
            <span className="text-xs font-bold tabular-nums text-neutral-900 dark:text-white mt-0.5">
              {dayjs.duration((currentTime || 0) * 1000).format('mm:ss')}
              {durationValue !== Infinity && <span className="text-neutral-400 mx-1">/</span>}
              {durationValue !== Infinity && dayjs.duration(Math.trunc(durationValue) * 1000).format('mm:ss')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isRecording && recordedAudio && blob && (
          <button
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-500 text-white shadow-md active:scale-90 transition-all hover:bg-green-600"
            onClick={handleSendRecording}
          >
            <Send size={18} fill="currentColor" />
          </button>
        )}
        <button
          className="h-10 w-10 flex items-center justify-center rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
          onClick={onClose}
          disabled={isRecording}
        >
          <X size={22} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default AudioContextMenu;
