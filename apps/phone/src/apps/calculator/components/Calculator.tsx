import React, { useMemo } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { Copy } from 'lucide-react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { CalculatorButton } from './CalculatorButton';
import { cn } from '@utils/cn';

const getFontSize = (length: number) => {
  if (length < 9) return 'text-5xl';
  if (length < 12) return 'text-4xl';
  if (length < 15) return 'text-3xl';
  return 'text-2xl';
};

export const Calculator: React.FC = () => {
  const {
    result,
    equals,
    clear,
    clearAll,
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
  } = useCalculator();

  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const resultStr = useMemo(
    () =>
      result().toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      }),
    [result],
  );

  const handleCopyClipboard = () => {
    setClipboard(resultStr);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }) as string || 'Resultado copiado!',
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Result Display */}
      <div className="relative flex-grow flex flex-col justify-end p-8 min-h-[14rem] animate-in fade-in duration-700">
        <button
          onClick={handleCopyClipboard}
          className="absolute top-6 left-6 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-primary transition-all active:scale-90 shadow-sm"
        >
          <Copy size={18} />
        </button>
        <div className={cn(
          "text-right font-black tracking-tighter tabular-nums break-all transition-all duration-300",
          getFontSize(resultStr.length)
        )}>
          {resultStr}
        </div>
      </div>

      {/* Numpad */}
      <div className="p-4 pb-8 bg-neutral-50/50 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-900 rounded-t-[40px] shadow-2xl">
        <div className="grid grid-cols-4 gap-3">
          <CalculatorButton buttonOpts={clear} isAction className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" />
          <CalculatorButton buttonOpts={clearAll} isAction className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" />
          <CalculatorButton buttonOpts={divider} isAction />
          <CalculatorButton buttonOpts={multiplier} isAction />

          <CalculatorButton buttonOpts={seven} />
          <CalculatorButton buttonOpts={eight} />
          <CalculatorButton buttonOpts={nine} />
          <CalculatorButton buttonOpts={substractor} isAction />

          <CalculatorButton buttonOpts={four} />
          <CalculatorButton buttonOpts={five} />
          <CalculatorButton buttonOpts={six} />
          <CalculatorButton buttonOpts={adder} isAction />

          <CalculatorButton buttonOpts={one} />
          <CalculatorButton buttonOpts={two} />
          <CalculatorButton buttonOpts={three} />
          <CalculatorButton buttonOpts={equals} isAction className="bg-primary hover:bg-primary/90" />

          <CalculatorButton buttonOpts={dot} />
          <CalculatorButton buttonOpts={zero} gridSpan={3} />
        </div>
      </div>
    </div>
  );
};
