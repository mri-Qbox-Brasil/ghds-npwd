import React, { useCallback, useEffect } from 'react';
import {
  MarketplaceResp,
  MarketplaceDatabaseLimits,
  MarketplaceEvents,
} from '@typings/marketplace';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { Camera, ChevronLeft } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900">
      {/* Header — inline, não DynamicHeader */}
      <div className="flex items-center justify-between px-4 pt-[60px] pb-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
        <button
          onClick={() => history.push('/marketplace')}
          className="flex items-center gap-0.5 text-blue-500 active:text-blue-600 transition-colors"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span className="text-[17px]">Voltar</span>
        </button>

        <span className="text-[17px] font-semibold text-neutral-900 dark:text-white">
          Novo anúncio
        </span>

        <button
          onClick={addListing}
          disabled={!areFieldsFilled}
          className={cn(
            "text-[17px] font-semibold transition-opacity",
            areFieldsFilled ? "text-blue-500 active:text-blue-600" : "text-neutral-300 dark:text-neutral-600"
          )}
        >
          Publicar
        </button>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-hide">
        {/* Image picker */}
        <div className="space-y-2">
          <button
            onClick={handleChooseImage}
            className="w-full aspect-[16/10] rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-2 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors overflow-hidden relative"
          >
            {formState.url ? (
              <>
                <img src={formState.url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity">
                  <Camera className="text-white" size={28} />
                </div>
              </>
            ) : (
              <>
                <Camera size={28} strokeWidth={1.5} className="text-neutral-400" />
                <span className="text-[13px] text-neutral-400 font-medium">
                  {t('MARKETPLACE.CHOOSE_IMAGE') as string}
                </span>
              </>
            )}
          </button>

          <input
            className="w-full h-10 px-4 bg-white dark:bg-neutral-800 border-none rounded-[10px] text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 transition-all"
            placeholder={t('MARKETPLACE.FORM_IMAGE') as string || "Ou cole o link da imagem..."}
            value={formState.url}
            onChange={handleUrlChange}
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[13px] font-medium text-neutral-500">Título</label>
            <span className="text-[11px] text-neutral-400 tabular-nums">{formState.title.length}/{MarketplaceDatabaseLimits.title}</span>
          </div>
          <input
            className="w-full h-11 px-4 bg-white dark:bg-neutral-800 border-none rounded-[10px] text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 transition-all"
            value={formState.title}
            onChange={handleTitleChange}
            placeholder={t('MARKETPLACE.FORM_TITLE') as string || "O que você está vendendo?"}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-[13px] font-medium text-neutral-500">Descrição</label>
            <span className="text-[11px] text-neutral-400 tabular-nums">{formState.description.length}/{MarketplaceDatabaseLimits.description}</span>
          </div>
          <textarea
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-none rounded-[10px] text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:ring-0 transition-all resize-none"
            placeholder={t('MARKETPLACE.FORM_DESCRIPTION') as string || "Descreva seu item..."}
            value={formState.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};
