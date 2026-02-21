import React, { useCallback, useEffect } from 'react';
import {
  MarketplaceResp,
  MarketplaceDatabaseLimits,
  MarketplaceEvents,
} from '@typings/marketplace';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Camera, Send, X, Type, AlignLeft, Link as LinkIcon } from 'lucide-react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useForm } from '../../hooks/state';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { cn } from '@utils/cn';

export const ListingForm: React.FC = () => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();
  const [formState, setFormState] = useForm();
  const { clean } = useWordFilter();

  const areFieldsFilled = formState.title.trim() !== '' && formState.description.trim() !== '';

  const addListing = () => {
    if (!areFieldsFilled) {
      return addAlert({
        message: t('MARKETPLACE.FEEDBACK.REQUIRED_FIELDS'),
        type: 'error',
      });
    }

    fetchNui<ServerPromiseResp<MarketplaceResp>>(MarketplaceEvents.ADD_LISTING, {
      ...formState,
      title: clean(formState.title),
      description: clean(formState.description),
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg),
          type: 'error',
        });
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_SUCCESS'),
        type: 'success',
      });
      history.push('/marketplace');
      setFormState({
        title: '',
        description: '',
        url: '',
      });
    });
  };

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > MarketplaceDatabaseLimits.title) return;
    setFormState({
      ...formState,
      title: e.currentTarget.value,
    });
  };

  const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > MarketplaceDatabaseLimits.url) return;
    setFormState({
      ...formState,
      url: e.currentTarget.value,
    });
  };

  const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > MarketplaceDatabaseLimits.description) return;
    setFormState({
      ...formState,
      description: e.currentTarget.value,
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    setFormState({
      ...formState,
      url: query.image,
    });
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, setFormState, formState]);

  return (
    <div className="px-6 py-8 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic leading-none">
          {t('MARKETPLACE.NEW_LISTING')}
        </h1>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Preencha os detalhes do seu anúncio</p>
      </header>

      <div className="space-y-6">
        {/* Titulo */}
        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 group-focus-within:text-blue-500 transition-colors">Título do Anúncio</label>
            <span className="text-[9px] font-bold text-neutral-400 tabular-nums">{formState.title.length}/{MarketplaceDatabaseLimits.title}</span>
          </div>
          <div className="relative">
            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
              value={formState.title}
              onChange={handleTitleChange}
              placeholder={t('MARKETPLACE.FORM_TITLE') as string || "O que você está vendendo?"}
            />
          </div>
        </div>

        {/* Escolher Imagem */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500">Mídia do Produto</label>
          </div>

          <button
            onClick={handleChooseImage}
            className="w-full aspect-video rounded-[32px] bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 dark:hover:bg-blue-500/5 transition-all group overflow-hidden relative shadow-inner"
          >
            {formState.url ? (
              <>
                <img src={formState.url} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={32} />
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="text-blue-500" size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-500">{t('MARKETPLACE.CHOOSE_IMAGE')}</span>
              </>
            )}
          </button>

          <div className="relative group">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-[11px] font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
              placeholder={t('MARKETPLACE.FORM_IMAGE') as string || "Ou cole o link da imagem..."}
              value={formState.url}
              onChange={handleUrlChange}
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 group-focus-within:text-blue-500 transition-colors">Descrição Detalhada</label>
            <span className="text-[9px] font-bold text-neutral-400 tabular-nums">{formState.description.length}/{MarketplaceDatabaseLimits.description}</span>
          </div>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <textarea
              rows={4}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-300 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm resize-none"
              placeholder={t('MARKETPLACE.FORM_DESCRIPTION') as string || "Descreva seu item..."}
              value={formState.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-4">
        <button
          onClick={addListing}
          disabled={!areFieldsFilled}
          className={cn(
            "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl",
            areFieldsFilled
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 cursor-not-allowed shadow-none"
          )}
        >
          <Send size={20} strokeWidth={3} />
          {t('MARKETPLACE.POST_LISTING')}
        </button>

        <button
          onClick={() => history.push('/marketplace')}
          className="w-full py-2 text-neutral-400 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] transition-colors"
        >
          Cancelar Anúncio
        </button>
      </div>
    </div>
  );
};
