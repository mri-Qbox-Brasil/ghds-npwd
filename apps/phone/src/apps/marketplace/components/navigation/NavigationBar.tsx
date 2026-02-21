import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, ShoppingBag, Plus } from 'lucide-react';
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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[240px] h-[64px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-neutral-800 shadow-2xl rounded-[28px] flex items-center justify-around px-2 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-2xl transition-all duration-300 group",
            item.active
              ? "text-blue-500 scale-110"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            item.active ? "bg-blue-500/10" : "group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800"
          )}>
            <item.icon size={22} strokeWidth={item.active ? 3 : 2} />
          </div>
          {item.active && (
            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-500 animate-in zoom-in duration-300" />
          )}
        </Link>
      ))}
    </div>
  );
};
