import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, PlusCircle } from 'lucide-react';
import { cn } from '@utils/cn';

export const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      label: "Início",
      icon: ShoppingBag,
      path: "/marketplace",
      active: pathname === "/marketplace"
    },
    {
      label: "Anunciar",
      icon: PlusCircle,
      path: "/marketplace/new",
      active: pathname === "/marketplace/new"
    }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-8 py-2 pb-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center gap-1 py-1 transition-colors",
            item.active
              ? "text-blue-500"
              : "text-neutral-400"
          )}
        >
          <item.icon size={24} strokeWidth={item.active ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
