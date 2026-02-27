import React from 'react';
import { useHistory } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';
import { BottomNav, BottomNavItem } from '@ui/components';

export function TwitterBottomNavigation({ activePage }: { activePage: number }) {
  const history = useHistory();

  const navItems = [
    { id: 0, path: '/twitter', icon: <Home size={24} strokeWidth={activePage === 0 ? 2.5 : 1.5} />, label: 'Início', exact: true },
    { id: 1, path: '/twitter/search', icon: <Search size={24} strokeWidth={activePage === 1 ? 2.5 : 1.5} />, label: 'Explorar', exact: false },
    { id: 2, path: '/twitter/profile', icon: <User size={24} strokeWidth={activePage === 2 ? 2.5 : 1.5} />, label: 'Perfil', exact: false },
  ];

  return (
    <BottomNav className="z-30 px-6 py-2 pb-6 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      {navItems.map((item) => (
        <BottomNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activePage === item.id}
          activeClassName="text-sky-500"
          onClick={() => history.push(item.path)}
        />
      ))}
    </BottomNav>
  );
}

export default TwitterBottomNavigation;
