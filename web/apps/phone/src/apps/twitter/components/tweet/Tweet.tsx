import React, { memo } from 'react';
import xss from 'xss';
import { useTranslation } from 'react-i18next';

import { FormattedTweet } from '@typings/twitter';
import { secondsToHumanReadable } from '../../utils/time';
import LikeButton from '../buttons/LikeButton';
import ReplyButton from '../buttons/ReplyButton';
import ImageDisplay from '../images/ImageDisplay';
import Avatar from '../Avatar';
import { RetweetButton } from '../buttons/RetweetButton';
import { usePhone } from '@os/phone/hooks/usePhone';
import Retweet from './Retweet';
import ShowMore from './ShowMore';
import { cn } from '@utils/cn';

interface TweetProps {
  tweet: FormattedTweet;
  setImageOpen: (val: string | null) => void;
  imageOpen: string | null;
}

export const Tweet: React.FC<TweetProps> = ({ tweet, imageOpen, setImageOpen }) => {
  const {
    id,
    message,
    images,
    avatar_url,
    profile_name,
    retweetProfileName,
    retweetAvatarUrl,
    retweetId,
    seconds_since_tweet,
    isLiked,
    isMine,
    isReported,
    isRetweet,
    likes,
  } = tweet;
  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableAvatars, enableImages } = ResourceConfig.twitter;

  const formattedMessage = message.replace(/\n\r?/g, '<br />');

  const sanitizedMessage = xss(formattedMessage, {
    whiteList: {
      br: [],
    },
  });

  const profileName = isRetweet ? retweetProfileName : profile_name;
  const formattedProfileName = profileName ? `@${profileName}` : '';

  const avatarUrl = isRetweet ? retweetAvatarUrl : avatar_url;

  return (
    <div className="flex w-full flex-col px-4 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors group">
      {isRetweet && <Retweet profileName={profile_name} />}

      <div className="flex gap-3">
        {enableAvatars && (
          <Avatar
            avatarUrl={avatarUrl}
            height={48}
            width={48}
            className="ring-2 ring-white dark:ring-neutral-900 shadow-sm"
          />
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-neutral-900 dark:text-white truncate hover:underline cursor-pointer">
                {profileName}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 font-medium truncate text-[13px]">
                {formattedProfileName}
              </span>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <span className="text-neutral-400 dark:text-neutral-500 text-[13px] shrink-0 font-medium">
                {secondsToHumanReadable(t, seconds_since_tweet)}
              </span>
            </div>
            <ShowMore isMine={isMine} isReported={isReported} id={id} />
          </div>

          <div
            className="text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 break-words"
            dangerouslySetInnerHTML={{
              __html: sanitizedMessage,
            }}
          />

          {enableImages && images && images.length > 0 && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <ImageDisplay visible images={images} />
            </div>
          )}

          <div className="flex items-center justify-between max-w-sm mt-2 -ml-2 text-neutral-400">
            <ReplyButton profile_name={profileName} />
            <div className="flex items-center">
              {ResourceConfig.twitter.allowRetweet && !isMine && (
                <RetweetButton tweetId={id} retweetId={retweetId} isRetweet={isRetweet} />
              )}
            </div>
            <LikeButton likes={likes} tweetId={id} isLiked={isLiked} />
            <div className="w-10"></div> {/* Spacer para manter o alinhamento centralizado */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Tweet);
