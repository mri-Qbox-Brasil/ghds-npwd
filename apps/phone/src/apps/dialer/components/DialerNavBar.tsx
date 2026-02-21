import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock, Contact2, Grid3X3 } from 'lucide-react';
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
      label: t('DIALER.NAVBAR_FAVORITES', 'Favoritos'),
      value: "/phone/favorites",
      icon: Star,
      to: "/phone/favorites",
      exact: true
    },
    {
      label: t('DIALER.NAVBAR_HISTORY', 'Recentes'),
      value: "/phone",
      icon: Clock,
      to: "/phone",
      exact: true
    },
    {
      label: t('DIALER.NAVBAR_CONTACTS', 'Contatos'),
      value: "/phone/contacts",
      icon: Contact2,
      to: "/phone/contacts",
      exact: false
    },
    {
      label: t('DIALER.NAVBAR_DIAL', 'Teclado'),
      value: "/phone/dial",
      icon: Grid3X3,
      to: "/phone/dial",
      exact: false
    }
  ];

  return (
    <nav className="flex items-center justify-around h-20 bg-[#F9F9F9]/80 dark:bg-black/80 backdrop-blur-xl border-t border-neutral-200/20 dark:border-neutral-800/50 shrink-0 select-none px-2">
      {navItems.map((item) => {
        const isActive = item.exact ? page === item.value : page.startsWith(item.value);
        const Icon = item.icon;

        return (
          <NavLink
            key={item.value}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center gap-1 group w-full transition-all active:scale-90 pt-1",
              isActive ? "text-[#007AFF]" : "text-neutral-500"
            )}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              fill="none"
              className="transition-colors duration-300"
            />
            <span className={cn(
              "text-[10px] font-medium leading-tight",
              isActive ? "opacity-100" : "opacity-80"
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
