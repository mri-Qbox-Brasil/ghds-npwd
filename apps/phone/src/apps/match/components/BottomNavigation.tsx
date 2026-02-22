import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Users, User } from 'lucide-react';
import { cn } from '@utils/cn';

interface MatchBottomNavigationProps {
  activePage: number;
}

export const MatchBottomNavigation: React.FC<MatchBottomNavigationProps> = ({ activePage }) => {
  const navItems = [
    { to: "/match", icon: Flame, label: "Descobrir", exact: true },
    { to: "/match/matches", icon: Users, label: "Matches", exact: false },
    { to: "/match/profile", icon: User, label: "Perfil", exact: false }
  ];

  return (
    <nav className="flex items-center justify-around px-6 py-2 pb-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 shrink-0 z-30">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activePage === index;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            exact={item.exact}
            className={cn(
              "flex flex-col items-center gap-1 py-1 transition-colors",
              isActive ? "text-pink-500" : "text-neutral-400"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MatchBottomNavigation;
