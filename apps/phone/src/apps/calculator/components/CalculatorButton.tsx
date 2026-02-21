import React, { HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

interface ButtonOptions {
  onClick: () => void;
  label: string;
}

type ButtonVariant = 'number' | 'operator' | 'function';

interface CalculatorButtonProps extends HTMLAttributes<HTMLButtonElement> {
  gridSpan?: number;
  buttonOpts: ButtonOptions;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  className,
  buttonOpts,
  variant = 'number',
  icon,
  isActive = false,
}) => {
  const variantStyles = {
    number: "bg-[#2b2b2b] text-white active:bg-[#636363]",
    operator: "bg-[#ff9500] text-white active:bg-[#fcc777]",
    function: "bg-[#3d3d3d] text-white active:bg-[#737373]",
  };

  // Special style for active operator
  const activeOperatorStyle = "bg-white text-[#ff9500]";

  // Override for mid-gray function buttons like AC, %
  const isMidGray = buttonOpts.label === 'AC' || buttonOpts.label === 'C' || buttonOpts.label === '%' || buttonOpts.label === '+/-';

  return (
    <button
      key={buttonOpts.label}
      onClick={buttonOpts.onClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        "w-full aspect-square text-[2.2rem] font-light",
        isActive ? activeOperatorStyle : (isMidGray ? "bg-[#5c5c5c] text-white active:bg-[#a5a5a5]" : variantStyles[variant]),
        className
      )}
    >
      {icon ? icon : (buttonOpts.label === '*' ? '×' : buttonOpts.label === '/' ? '÷' : buttonOpts.label)}
    </button>
  );
};
