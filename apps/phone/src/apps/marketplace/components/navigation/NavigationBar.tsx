import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ShoppingBag, PlusCircle } from 'lucide-react';
import { BottomNav, BottomNavItem } from '@ui/components';

export const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  const navItems = [
    {
      label: "Início",
      icon: <ShoppingBag size={24} strokeWidth={pathname === "/marketplace" ? 2.5 : 1.5} />,
      path: "/marketplace",
      active: pathname === "/marketplace"
    },
    {
      label: "Anunciar",
      icon: <PlusCircle size={24} strokeWidth={pathname === "/marketplace/new" ? 2.5 : 1.5} />,
      path: "/marketplace/new",
      active: pathname === "/marketplace/new"
    }
  ];

  return (
    <BottomNav className="z-50 px-8 py-2 pb-6 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
      {navItems.map((item) => (
        <BottomNavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          isActive={item.active}
          onClick={() => history.push(item.path)}
        />
      ))}
    </BottomNav>
  );
};
