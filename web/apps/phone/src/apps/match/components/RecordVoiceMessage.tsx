import Modal from '@ui/components/Modal';
import React, { useEffect, useRef, useState } from 'react';
import { CircleDot, Square, Play, Pause, X, Loader2 } from 'lucide-react';
import { useRecorder } from '@os/audio/hooks/useRecorder';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { NPWDButton } from '@npwd/keyos';
import { cn } from '@utils/cn';

dayjs.extend(duration);

interface IProps {
  open: boolean;
  closeModal: () => void;
  setVoiceMessage: (voiceMessage: Blob) => void;
}

const RecordVoiceMessage = ({ open, closeModal, setVoiceMessage }: IProps) => {
  const {
    blob,
    audio: recordedAudio,
    recordingState,
    startRecording,
    stopRecording,
  } = useRecorder();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);

  const audioRef = useRef(new Audio());
  const durationValue = audioRef.current.duration;

  useEffect(() => {
    if (recordedAudio) {
      audioRef.current.src = recordedAudio;
    }
  }, [recordedAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      setCurrentTime(Math.trunc(audio.currentTime));
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

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

  const handleSaveRecording = () => {
    if (!blob) return;
    setVoiceMessage(blob);
    closeModal();
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Bio em Áudio</h2>
          <button onClick={closeModal} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-700/50 space-y-6">
          <div className="relative">
            {recordingState.isRecording && (
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping scale-150" />
            )}
            <button
              onClick={recordingState.isRecording ? handleStopRecording : handleStartRecord}
              className={cn(
                "relative h-20 w-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 z-10",
                recordingState.isRecording ? "bg-red-500 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-red-500 hover:bg-neutral-300"
              )}
            >
              {recordingState.isRecording ? <Square size={32} /> : <CircleDot size={32} />}
            </button>
          </div>

          <div className="text-center">
            {recordingState.isRecording ? (
              <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Gravando...
              </div>
            ) : recordedAudio ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={playing ? pause : play}
                  className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95"
                >
                  {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {playing ? "Pausar" : "Ouvir Gravação"}
                </button>
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-2">
                  {dayjs.duration(currentTime * 1000).format('mm:ss')}
                  {durationValue && durationValue !== Infinity ? ` / ${dayjs.duration(Math.trunc(durationValue) * 1000).format('mm:ss')}` : ''}
                </span>
              </div>
            ) : (
              <p className="text-sm font-medium text-neutral-400">Toque no botão para gravar sua bio</p>
            )}
          </div>
        </div>

        {!recordingState.isRecording && recordedAudio && blob && (
          <NPWDButton
            onClick={handleSaveRecording}
            className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/30 transition-all active:scale-95"
          >
            Salvar Áudio
          </NPWDButton>
        )}
      </div>
    </Modal>
  );
};

export default RecordVoiceMessage;
