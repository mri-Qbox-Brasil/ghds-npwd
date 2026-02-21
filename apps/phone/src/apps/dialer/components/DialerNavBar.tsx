import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History, LayoutGrid, User } from 'lucide-react';
import { cn } from '@utils/cn';

const DialerNavBar: React.FC = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname);
  const [t] = useTranslation();

  useEffect(() => {
    setPage(location.pathname);
  }, [location]);

  const navItems = [
    {
      label: t('DIALER.NAVBAR_HISTORY'),
      value: "/phone",
      icon: History,
      to: "/phone",
      exact: true
    },
    {
      label: t('DIALER.NAVBAR_DIAL'),
      value: "/phone/dial",
      icon: LayoutGrid,
      to: "/phone/dial",
      exact: false
    },
    {
      label: t('DIALER.NAVBAR_CONTACTS'),
      value: "/phone/contacts",
      icon: User,
      to: "/phone/contacts",
      exact: false
    }
  ];

  return (
    <nav className="flex items-center justify-around h-20 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 shrink-0 select-none">
      {navItems.map((item) => {
        const isActive = item.exact ? page === item.value : page.startsWith(item.value);
        const Icon = item.icon;

        return (
          <NavLink
            key={item.value}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-1 group w-full transition-all active:scale-90",
              isActive ? "text-blue-500" : "text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
            )}
          >
            <div className={cn(
              "p-1 rounded-xl transition-colors",
              isActive ? "bg-blue-50 dark:bg-blue-500/10" : "group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/50"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isActive ? "opacity-100" : "opacity-60"
            )}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default DialerNavBar;
