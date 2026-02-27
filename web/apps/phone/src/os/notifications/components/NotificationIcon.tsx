import React from 'react';
import { NavLink } from 'react-router-dom';

interface INotificationIcon {
  icon: JSX.Element;
  to: string;
}

export const NotificationIcon = ({ icon, to }: INotificationIcon) => {
  return (
    <NavLink
      to={to}
      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors inline-flex items-center justify-center text-neutral-600 dark:text-neutral-300"
    >
      {icon}
    </NavLink>
  );
};
