import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import DialogForm from '../../../ui/components/DialogForm';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useCustomWallpaperModal } from '../state/customWallpaper.state';
import { Wallpaper, Text, X, Check, Image as ImageIcon } from 'lucide-react';

const WallpaperModal: React.FC = () => {
  const [customWallpaperModal, setCustomWallpaperModal] = useCustomWallpaperModal();
  const [settings, setSettings] = useSettings();
  const [t] = useTranslation();
  const [value, setValue] = useState(settings.wallpaper.value ? settings.wallpaper.value : '');
  const { addAlert } = useSnackbar();

  const isImageAndUrl = (url: string) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
  };

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleNewWallpaper = () => {
    if (isImageAndUrl(value)) {
      handleSettingChange('wallpaper', {
        label: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE'),
        value,
      });
      setCustomWallpaperModal(false);
    } else {
      addAlert({
        message: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_ERROR') as string || 'URL de imagem inválida',
        type: 'error'
      });
    }
  };

  return (
    <DialogForm
      open={customWallpaperModal}
      handleClose={() => setCustomWallpaperModal(false)}
      onSubmit={handleNewWallpaper}
      title={""}
      content={""}
      className="p-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 rounded-3xl"
    >
      <header className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <Wallpaper size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Personalizar</h2>
        </div>
        <button onClick={() => setCustomWallpaperModal(false)} className="text-neutral-400 hover:text-red-500 transition-colors">
          <X size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 italic">Cole a URL da Imagem:</p>
          <div className="relative group">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
              placeholder="https://exemplo.com/imagem.png"
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </div>
          <p className="px-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 italic leading-snug">
            {t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_CONTENT') as string || 'Escolha uma imagem da web para usar como fundo do seu telefone.'}
          </p>
        </div>

        {isImageAndUrl(value) && (
          <div className="animate-in zoom-in-95 duration-500">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 px-1 mb-3 italic">Prévia:</p>
            <div className="aspect-[9/16] w-32 mx-auto rounded-2xl border-4 border-white dark:border-neutral-800 shadow-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img src={value} className="w-full h-full object-cover" alt="Preview" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleNewWallpaper}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Check size={20} strokeWidth={3} />
            Aplicar Fundo
          </button>
          <button
            onClick={() => setCustomWallpaperModal(false)}
            className="w-full py-3.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </DialogForm>
  );
};

export default WallpaperModal;
