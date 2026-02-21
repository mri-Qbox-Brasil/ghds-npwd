import React, { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { IApp } from '@os/apps/config/apps';

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
  app: IApp;
}

// Taso: Maybe we should pass an icon (maybe fa?) as a prop as well at somepoint
// but need to think about the best way to do that for standardization sake.
export const AppTitle: React.FC<AppTitleProps> = ({
  app: { backgroundColor, color, nameLocale },
  ...props
}) => {
  const [t] = useTranslation();
  return (
    // TODO: Support color and backgroundColor
    <div className="px-5 py-2 pt-4 bg-[#F6F6F67] dark:bg-black" {...props}>
      <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {t(nameLocale) as unknown as string}
      </h3>
    </div>
  );
};
