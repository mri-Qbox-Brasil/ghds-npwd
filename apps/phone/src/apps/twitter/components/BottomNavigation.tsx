import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';
import { cn } from '@utils/cn';

export function TwitterBottomNavigation({ activePage }: { activePage: number }) {
  const navItems = [
    { id: 0, path: '/twitter', icon: Home, label: 'Início', exact: true },
    { id: 1, path: '/twitter/search', icon: Search, label: 'Explorar', exact: false },
    { id: 2, path: '/twitter/profile', icon: User, label: 'Perfil', exact: false },
  ];

  return (
    <nav className="flex items-center justify-around px-6 py-2 pb-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 shrink-0 z-30">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            exact={item.exact}
            className={cn(
              "flex flex-col items-center gap-1 py-1 transition-colors",
              isActive
                ? "text-sky-500"
                : "text-neutral-400"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default TwitterBottomNavigation;
