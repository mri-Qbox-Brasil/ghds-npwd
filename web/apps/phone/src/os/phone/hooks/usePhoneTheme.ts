import { useSettings } from '../../../apps/settings/hooks/useSettings';

export const usePhoneTheme = () => {
  const [settings] = useSettings();
  return {
    mode: settings.theme.value.includes('dark') ? 'dark' : 'light',
    themeName: settings.theme.value
  };
};

export const usePhoneTheme2 = () => {
  const toggleTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('npwd-colorscheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('npwd-colorscheme', 'light');
    }
  };

  return { toggleTheme };
};
