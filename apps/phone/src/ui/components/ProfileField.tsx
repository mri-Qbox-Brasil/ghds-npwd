import { forwardRef } from 'react';
import { NPWDInput } from './Input';
import { cn } from '@utils/cn';

interface ProfileFieldProps {
  label: string;
  value: string;
  handleChange?: (val: string) => void;
  allowChange?: boolean;
  multiline?: boolean;
  maxLength?: number;
  className?: string;
}

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, value, handleChange, allowChange, multiline, maxLength, className }, ref) => {
    const _handleChange = (e) => handleChange?.(e.target.value);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full group", className)}>
        <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-primary">
          {label}
        </label>
        <NPWDInput
          ref={ref as any}
          className={cn(
            "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl h-12 transition-all duration-300",
            !allowChange && "opacity-50 grayscale cursor-not-allowed"
          )}
          value={value}
          onChange={_handleChange}
          disabled={!allowChange}
          placeholder={`Digite seu ${label.toLowerCase()}...`}
          maxLength={maxLength}
        // Note: multiline needs to be handled by NPWDInput or use a textarea here
        />
      </div>
    );
  },
);

ProfileField.defaultProps = {
  allowChange: true,
  maxLength: 200,
  multiline: false,
};

export default ProfileField;
