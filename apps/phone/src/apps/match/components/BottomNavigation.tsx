import React from 'react';
import { useHistory } from 'react-router-dom';
import { Flame, Users, User } from 'lucide-react';
import { BottomNav, BottomNavItem } from '@ui/components';

interface MatchBottomNavigationProps {
  activePage: number;
}

export const MatchBottomNavigation: React.FC<MatchBottomNavigationProps> = ({ activePage }) => {
  const history = useHistory();

  const navItems = [
    { to: "/match", icon: <Flame size={24} strokeWidth={activePage === 0 ? 2.5 : 1.5} />, label: "Descobrir" },
    { to: "/match/matches", icon: <Users size={24} strokeWidth={activePage === 1 ? 2.5 : 1.5} />, label: "Matches" },
    { to: "/match/profile", icon: <User size={24} strokeWidth={activePage === 2 ? 2.5 : 1.5} />, label: "Perfil" }
  ];

  return (
    <BottomNav className="z-30 px-6 py-2 pb-6 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      {navItems.map((item, index) => (
        <BottomNavItem
          key={item.to}
          icon={item.icon}
          label={item.label}
          isActive={activePage === index}
          activeClassName="text-pink-500"
          onClick={() => history.push(item.to)}
        />
      ))}
    </BottomNav>
  );
};

export default MatchBottomNavigation;
