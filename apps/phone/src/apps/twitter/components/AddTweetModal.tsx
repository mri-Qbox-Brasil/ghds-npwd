import { memo, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal2 } from '../../../ui/components/Modal';
import { IMAGE_DELIMITER } from '../utils/images';
import { isImageValid } from '@common/utils/isImageValid';
import { useModal } from '../hooks/useModal';
import EmojiSelect from './EmojiSelect';
import ImageDisplay from './images/ImageDisplay';
import ImagePrompt from './images/ImagePrompt';
import TweetMessage from './tweet/TweetMessage';
import ControlButtons from './buttons/ControlButtons';
import IconButtons from './buttons/IconButtons';
import { usePhone } from '@os/phone/hooks/usePhone';
import { getNewLineCount } from '../utils/message';
import { NewTweet, TwitterEvents } from '@typings/twitter';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useTranslation } from 'react-i18next';
import { promiseTimeout } from '@utils/promiseTimeout';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { toggleKeys } from '@ui/components';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';

interface Image {
  id: string;
  link: string;
}

const AddTweetModal = () => {
  const { message, setMessage, modalVisible, setModalVisible } = useModal();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { clean } = useWordFilter();

  const [showEmoji, setShowEmoji] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [link, setLink] = useState('');

  const [images, setImages] = useState<Image[]>([]);

  const reset = () => {
    setShowImagePrompt(false);
    setShowEmoji(false);

    setLink('');
    setImages([]);
    setMessage('');
  };

  const _handleClose = () => {
    reset();
    setModalVisible(false);
  };

  const handleImageChange = useCallback((link, shouldSubmit) => {
    setLink(link);
    if (shouldSubmit) return setShowImagePrompt(true);
  }, []);

  const handleMessageChange = useCallback((message) => setMessage(message), [setMessage]);

  if (!ResourceConfig) return null;
  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  const isValidMessage = (message) => {
    if (message.length > characterLimit) return false;
    if (getNewLineCount(message) < newLineLimit) return true;
  };

  const isEmptyMessage = () => {
    const cleanedMessage = clean(message.trim());
    if (
      (cleanedMessage && cleanedMessage.length > 0 && isValidMessage(cleanedMessage)) ||
      (images && images.length > 0)
    ) {
      return false;
    }
    return true;
  };

  const submitTweet = async () => {
    await promiseTimeout(200);
    const cleanedMessage = clean(message.trim());
    if (isEmptyMessage()) return;

    const data: NewTweet = {
      message: cleanedMessage,
      retweet: null,
      images:
        images && images.length > 0 ? images.map((image) => image.link).join(IMAGE_DELIMITER) : '',
    };

    fetchNui<ServerPromiseResp<void>>(TwitterEvents.CREATE_TWEET, data).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('TWITTER.FEEDBACK.CREATE_PROFILE_FAILURE') as unknown as string,
        });
      }
    });

    _handleClose();
  };

  const addImage = () => {
    const cleanedLink = link.replace('/ /g', '');
    const image = { id: uuidv4(), link: cleanedLink };
    isImageValid(cleanedLink)
      .then(() => setImages([...images, image]))
      .catch((e) => console.error(e));

    setShowImagePrompt(false);
    setLink('');
  };
  const removeImage = (id: string) => setImages(images.filter((image) => id !== image.id));

  const toggleShowImagePrompt = () => {
    setShowEmoji(false);
    setShowImagePrompt(!showImagePrompt);
  };
  const toggleShowEmoji = async () => {
    setShowImagePrompt(false);
    setShowEmoji(!showEmoji);

    await toggleKeys(showEmoji);
  };

  const handleSelectEmoji = (emojiObject) => {
    setMessage(message.concat(emojiObject.native));
  };

  if (!ResourceConfig) return null;

  return (
    <Modal2 visible={modalVisible} handleClose={_handleClose}>
      <div className="flex flex-col gap-4">
        <TweetMessage
          modalVisible={modalVisible}
          onEnter={submitTweet}
          message={message}
          handleChange={handleMessageChange}
        />
        <ImagePrompt visible={showImagePrompt} value={link} handleChange={handleImageChange} />
        <EmojiSelect visible={showEmoji} onEmojiClick={handleSelectEmoji} />
        <ImageDisplay
          visible={!showEmoji && images.length > 0}
          images={images}
          removeImage={removeImage}
        />
        <div className="flex flex-row justify-between items-center py-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
          <IconButtons
            onImageClick={
              images.length < ResourceConfig.twitter.maxImages ? toggleShowImagePrompt : null
            }
            onEmojiClick={toggleShowEmoji}
          />
          <ControlButtons
            showImagePrompt={showImagePrompt}
            showEmoji={showEmoji}
            onPrimaryClick={showImagePrompt ? addImage : submitTweet}
            onCloseClick={showEmoji ? toggleShowEmoji : toggleShowImagePrompt}
          />
        </div>
      </div>
    </Modal2>
  );
};

export default memo(AddTweetModal);
