import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock, Contact2, Grid3X3 } from 'lucide-react';
import { BottomNav, BottomNavItem } from '@ui/components';

const DialerNavBar: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(location.pathname);
  const { t } = useTranslation();

  useEffect(() => {
    setPage(location.pathname);
  }, [location]);

  const navItems = [
    {
      label: t('DIALER.NAVBAR_FAVORITES') || 'Favoritos',
      value: "/phone/favorites",
      icon: Star,
      to: "/phone/favorites",
      exact: true
    },
    {
      label: t('DIALER.NAVBAR_HISTORY') || 'Recentes',
      value: "/phone",
      icon: Clock,
      to: "/phone",
      exact: true
    },
    {
      label: t('DIALER.NAVBAR_CONTACTS') || 'Contatos',
      value: "/phone/contacts",
      icon: Contact2,
      to: "/phone/contacts",
      exact: false
    },
    {
      label: t('DIALER.NAVBAR_DIAL') || 'Teclado',
      value: "/phone/dial",
      icon: Grid3X3,
      to: "/phone/dial",
      exact: false
    }
  ];

  return (
    <BottomNav className="z-40 h-[80px] bg-[#F9F9F9]/80 dark:bg-black/80 backdrop-blur-xl border-t border-neutral-200/20 dark:border-neutral-800/50">
      {navItems.map((item) => {
        const isActive = item.exact ? page === item.value : page.startsWith(item.value);
        const Icon = item.icon;

        return (
          <BottomNavItem
            key={item.value}
            icon={<Icon size={24} strokeWidth={isActive ? 2.5 : 2} />}
            label={item.label}
            isActive={isActive}
            activeClassName="text-[#007AFF]"
            onClick={() => history.push(item.to)}
          />
        );
      })}
    </BottomNav>
  );
};

export default DialerNavBar;
