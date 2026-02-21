import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { Flex } from '@ui/components/ui/flex';
import { ImagePlus } from 'lucide-react';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';

export const ImagePrompt = ({ visible, value, handleChange }: { visible: boolean, value: string, handleChange: (val: string, submit: boolean) => void }) => {
  const textFieldRef = useRef(null);
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

  useEffect(() => {
    textFieldRef.current && textFieldRef.current.focus();
  }, [visible]);

  const handleImageChange = useCallback(
    (e, shouldSubmit) => handleChange(e.target.value, shouldSubmit),
    [handleChange],
  );

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

  useEffect(() => {
    if (!query?.image) return;
    handleChange(query.image, true);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, handleChange]);

  if (!visible) return null;
  return (
    <div className="flex justify-between items-center w-full gap-2 mt-4">
      <TextField
        value={value}
        onChange={(e) => handleImageChange(e, false)}
        className="flex-1 text-[16px] px-3 py-2 bg-neutral-100/50 dark:bg-neutral-800/50 border-none rounded-xl text-neutral-900 dark:text-gray-100 placeholder:text-neutral-400"
        placeholder={t('TWITTER.IMAGE_PLACEHOLDER') || 'Image URL'}
        ref={textFieldRef}
      />
      <button
        onClick={handleChooseImage}
        className="shrink-0 p-2.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-blue-500 transition-colors"
        title="Select an image from your gallery"
      >
        <ImagePlus size={24} />
      </button>
    </div>
  );
};

export default memo(ImagePrompt);
