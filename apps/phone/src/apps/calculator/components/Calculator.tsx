import React, { useMemo, useState } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { History, X, Trash2 } from 'lucide-react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { CalculatorButton } from './CalculatorButton';
import { cn } from '@utils/cn';

const getFontSize = (length: number) => {
  if (length < 6) return 'text-[6rem]';
  if (length < 8) return 'text-[5rem]';
  if (length < 10) return 'text-[4rem]';
  if (length < 12) return 'text-[3.3rem]';
  if (length < 14) return 'text-[2.8rem]';
  if (length < 17) return 'text-[2.2rem]';
  return 'text-[1.7rem]';
};

export const Calculator: React.FC = () => {
  const {
    displayValue,
    expression,
    activeOperator,
    isEntryDirty,
    history,
    clearHistory,
    restoreFromHistory,
    equals,
    clear,
    divider,
    multiplier,
    substractor,
    adder,
    dot,
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    percentage,
    toggleSign,
    backspace,
  } = useCalculator();

  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const formattedDisplay = useMemo(() => {
    if (displayValue.includes('e')) {
      return displayValue.replace('.', ',');
    }
    const [int, dec] = displayValue.split('.');
    const numInt = Number(int);
    if (isNaN(numInt)) return displayValue.replace('.', ',');

    const formattedInt = numInt.toLocaleString('pt-BR');
    return dec !== undefined ? `${formattedInt},${dec}` : formattedInt;
  }, [displayValue]);

  const handleCopyClipboard = () => {
    setClipboard(displayValue);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }) as string || 'Resultado copiado!',
      type: 'success',
    });
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStart === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const distance = touchStart - clientX;
    if (Math.abs(distance) > 30) {
      backspace.onClick();
    }
    setTouchStart(null);
  };

  const handleHistoryItemClick = (val: string) => {
    restoreFromHistory(val);
    setIsHistoryOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white select-none pt-20 relative overflow-hidden">
      {/* Result Display */}
      <div
        className="relative flex-grow flex flex-col justify-end px-6 pb-2 min-h-[12rem] cursor-default overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="absolute top-0 right-4 p-2 z-10 rounded-full bg-white/5 text-white/20 hover:text-white transition-colors"
        >
          <History size={18} />
        </button>

        <div className="text-right text-white/30 text-lg font-light h-6 mb-1 px-8 tabular-nums truncate">
          {expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/\./g, ',')}
        </div>

        <div className={cn(
          "flex justify-end pr-4 pb-2 transition-all duration-300"
        )}>
          <div className={cn(
            "font-light tracking-tight leading-none whitespace-nowrap select-text cursor-pointer",
            getFontSize(formattedDisplay.length)
          )}
            onClick={handleCopyClipboard}
          >
            {formattedDisplay}
          </div>
        </div>
      </div>

      {/* Numpad */}
      <div className="px-5 pb-16 pt-4 bg-black">
        <div className="grid grid-cols-4 gap-[12px]">
          <CalculatorButton buttonOpts={clear} variant="function" />
          <CalculatorButton buttonOpts={toggleSign} variant="function" />
          <CalculatorButton buttonOpts={percentage} variant="function" />
          <CalculatorButton buttonOpts={divider} variant="operator" isActive={activeOperator === '/'} />

          <CalculatorButton buttonOpts={seven} variant="number" />
          <CalculatorButton buttonOpts={eight} variant="number" />
          <CalculatorButton buttonOpts={nine} variant="number" />
          <CalculatorButton buttonOpts={multiplier} variant="operator" isActive={activeOperator === '*'} />

          <CalculatorButton buttonOpts={four} variant="number" />
          <CalculatorButton buttonOpts={five} variant="number" />
          <CalculatorButton buttonOpts={six} variant="number" />
          <CalculatorButton buttonOpts={substractor} variant="operator" isActive={activeOperator === '-'} />

          <CalculatorButton buttonOpts={one} variant="number" />
          <CalculatorButton buttonOpts={two} variant="number" />
          <CalculatorButton buttonOpts={three} variant="number" />
          <CalculatorButton buttonOpts={adder} variant="operator" isActive={activeOperator === '+'} />

          <CalculatorButton buttonOpts={zero} variant="number" className="col-span-2 !aspect-auto !justify-start px-8" />
          <CalculatorButton buttonOpts={dot} variant="number" />
          <CalculatorButton buttonOpts={equals} variant="operator" />
        </div>
      </div>

      {/* History Overlay */}
      <div className={cn(
        "absolute inset-0 bg-black/90 backdrop-blur-xl z-[200] transition-transform duration-500 ease-in-out px-6 pt-20 pb-10 flex flex-col",
        isHistoryOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Histórico</h2>
          <div className="flex gap-4">
            <button
              onClick={clearHistory}
              className="p-2 bg-white/10 rounded-full text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Limpar Histórico"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-2 bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20 select-none">
              <History size={48} className="mb-4 opacity-20" />
              <p>Nenhum histórico disponível</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleHistoryItemClick(item.result)}
                  className="group flex flex-col items-end cursor-pointer active:scale-[0.98] transition-all"
                >
                  <span className="text-sm text-white/30 group-hover:text-white/50 transition-colors mb-1">
                    {item.expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/\./g, ',')}
                  </span>
                  <span className="text-3xl font-light text-white group-hover:text-[#ff9500] transition-colors">
                    {item.result.replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/20 text-xs">
          Toque em um resultado para usá-lo na calculadora
        </div>
      </div>
    </div>
  );
};
