import React, { useMemo } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { History, Delete } from 'lucide-react';
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
    percentage,
    toggleSign,
    backspace,
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
    <div className="flex flex-col h-full bg-black text-white select-none">
      {/* Result Display */}
      <div className="relative flex-grow flex flex-col justify-end px-6 pb-2 min-h-[16rem]">
        <button
          onClick={handleCopyClipboard}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/20 hover:text-white transition-colors"
        >
          <History size={20} />
        </button>

        <div className={cn(
          "text-right font-light tracking-tight tabular-nums break-all transition-all duration-300 pr-2 pb-2 leading-none",
          getFontSize(resultStr.length)
        )}>
          {resultStr.replace('.', ',')}
        </div>
      </div>

      {/* Numpad - 5 Rows x 4 Cols */}
      <div className="px-5 pb-10 pt-4 bg-black">
        <div className="grid grid-cols-4 gap-[12px]">
          {/* Row 1 */}
          <CalculatorButton buttonOpts={backspace} variant="number" icon={<Delete size={28} strokeWidth={1.5} />} />
          <CalculatorButton buttonOpts={resultStr === '0' ? clearAll : clear} variant="function" />
          <CalculatorButton buttonOpts={percentage} variant="function" />
          <CalculatorButton buttonOpts={divider} variant="operator" />

          {/* Row 2 */}
          <CalculatorButton buttonOpts={seven} variant="number" />
          <CalculatorButton buttonOpts={eight} variant="number" />
          <CalculatorButton buttonOpts={nine} variant="number" />
          <CalculatorButton buttonOpts={multiplier} variant="operator" />

          {/* Row 3 */}
          <CalculatorButton buttonOpts={four} variant="number" />
          <CalculatorButton buttonOpts={five} variant="number" />
          <CalculatorButton buttonOpts={six} variant="number" />
          <CalculatorButton buttonOpts={substractor} variant="operator" />

          {/* Row 4 */}
          <CalculatorButton buttonOpts={one} variant="number" />
          <CalculatorButton buttonOpts={two} variant="number" />
          <CalculatorButton buttonOpts={three} variant="number" />
          <CalculatorButton buttonOpts={adder} variant="operator" />

          {/* Row 5 */}
          <CalculatorButton buttonOpts={toggleSign} variant="number" />
          <CalculatorButton buttonOpts={zero} variant="number" />
          <CalculatorButton buttonOpts={dot} variant="number" />
          <CalculatorButton buttonOpts={equals} variant="operator" />
        </div>
      </div>
    </div>
  );
};
