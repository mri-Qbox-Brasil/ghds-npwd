import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, User, Bell } from 'lucide-react';
import { cn } from '@utils/cn';

export function TwitterBottomNavigation({ activePage }: { activePage: number }) {
  const navItems = [
    { id: 0, path: '/twitter', icon: Home, label: 'Início', exact: true },
    { id: 1, path: '/twitter/search', icon: Search, label: 'Explorar', exact: false },
    { id: 2, path: '/twitter/profile', icon: User, label: 'Perfil', exact: false },
  ];

  return (
    <nav className="flex items-center justify-around h-16 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 shrink-0 z-30">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            exact={item.exact}
            className={cn(
              "flex flex-col items-center justify-center grow h-full transition-all group active:scale-95",
              isActive ? "text-sky-500" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-2xl transition-colors",
              isActive ? "bg-sky-50 dark:bg-sky-500/10" : "group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/50"
            )}>
              <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default TwitterBottomNavigation;
