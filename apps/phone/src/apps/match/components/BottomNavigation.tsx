import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Users, User } from 'lucide-react';
import { cn } from '@utils/cn';

interface MatchBottomNavigationProps {
  activePage: number;
}

export const MatchBottomNavigation: React.FC<MatchBottomNavigationProps> = ({ activePage }) => {
  const navItems = [
    {
      to: "/match",
      icon: Flame,
      label: "Descobrir",
      exact: true
    },
    {
      to: "/match/matches",
      icon: Users,
      label: "Matches",
      exact: false
    },
    {
      to: "/match/profile",
      icon: User,
      label: "Perfil",
      exact: false
    }
  ];

  return (
    <nav className="flex items-center justify-around h-20 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 shrink-0 select-none">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activePage === index;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            exact={item.exact}
            className={cn(
              "flex flex-col items-center justify-center gap-1 group w-full transition-all active:scale-90",
              isActive ? "text-pink-500" : "text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
            )}
          >
            <div className={cn(
              "p-1 rounded-xl transition-colors",
              isActive ? "bg-pink-50 dark:bg-pink-500/10" : "group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/50"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300",
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
            )}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MatchBottomNavigation;
