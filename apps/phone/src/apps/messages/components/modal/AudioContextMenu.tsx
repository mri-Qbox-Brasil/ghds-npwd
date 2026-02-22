import React, { useEffect, useRef, useState } from 'react';
import { CircleDot, X, Square, Play, Pause, Send, Mic, Trash2, SendHorizontal } from 'lucide-react';
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
    <div className="flex items-end justify-between w-full gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Left Action: Trash/Cancel - Matches Plus Button exactly */}
      <div className="flex items-center justify-center mb-0.5">
        <button
          className="p-2 rounded-full text-neutral-400 hover:text-red-500 transition-all active:scale-95"
          onClick={onClose}
          disabled={isRecording}
        >
          <Trash2 size={24} className="stroke-[2px]" />
        </button>
      </div>

      {/* Center Record/Review Pill - Matches Message Input Pill exactly */}
      <div className="flex-1 min-w-0 bg-neutral-100 dark:bg-[#1C1C1E] border border-neutral-300/50 dark:border-white/10 rounded-[20px] px-3 py-1 flex items-end transition-all">
        <div className="flex-1 flex items-center justify-center min-h-[32px] min-w-0">
          {!recordedAudio && !isRecording ? (
            <button
              className="flex items-center gap-2 px-3 py-1 rounded-full transition-colors active:opacity-70"
              onClick={handleStartRecord}
            >
              <Mic size={20} className="text-red-500" />
              <span className="text-[16px] font-medium text-neutral-500">Tap to record</span>
            </button>
          ) : isRecording ? (
            <div className="flex items-center gap-3 py-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[17px] font-semibold tabular-nums text-neutral-900 dark:text-white leading-none">
                {dayjs.duration(recordingState.duration, 'seconds').format('mm:ss')}
              </span>
              <button
                onClick={handleStopRecording}
                className="ml-4 h-[26px] px-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-all"
              >
                Stop
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full py-1">
              <button
                className="h-7 w-7 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-sm active:scale-90 transition-all"
                onClick={playing ? pause : play}
              >
                {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="flex-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden relative">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${((currentTime || 0) / (durationValue || 1)) * 100}%` }}
                />
              </div>

              <span className="text-[14px] font-semibold tabular-nums text-neutral-900 dark:text-white">
                {dayjs.duration(Math.trunc(durationValue) * 1000).format('m:ss')}
              </span>
            </div>
          )}
        </div>

        {/* Action Button inside Pill - Matches Send position */}
        {!isRecording && recordedAudio && blob && (
          <div className="mb-0.5 ml-1">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white transition-all active:scale-90"
              onClick={handleSendRecording}
            >
              <SendHorizontal size={16} fill="white" />
            </button>
          </div>
        )}
      </div>

      {/* Spacing to match MessageInput exactly */}
      <div className="w-1" />
    </div>
  );
};

export default AudioContextMenu;
