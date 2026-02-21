import React from 'react';
import { SearchContacts } from './SearchContacts';
import { Link, useHistory } from 'react-router-dom';
import { useFilteredContacts } from '../../hooks/state';
import { Contact, ContactEvents } from "@typings/contact";
import { useCall } from '@os/call/hooks/useCall';
import useMessages from '@apps/messages/hooks/useMessages';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { Phone, MessageSquare, Plus, Clipboard, UsersRound, User } from 'lucide-react';
import { List, ListItem, NPWDButton } from '@npwd/keyos';
import { initials } from '@utils/misc';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { Tooltip } from '@ui/components/Tooltip';
import { useTwitterProfileValue } from "@apps/twitter/hooks/state";
import { IMG_DEFAULT_AVATAR } from "@apps/twitter/utils/constants";
import { useTranslation } from "react-i18next";
import { setClipboard } from "@os/phone/hooks";
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from "@utils/fetchNui";
import { cn } from '@utils/cn';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();
  const [t] = useTranslation();
  const profile = useTwitterProfileValue();
  const myNumber = useMyPhoneNumber();

  const avatar_url = profile?.avatar_url;
  const myName = profile?.profile_name || t('CONTACTS.MY_NUMBER', 'Meu número');

  const groupedContacts = filteredContacts.reduce((r, e) => {
    const group = e.display.charAt(0).toUpperCase();
    if (!r[group]) r[group] = { group, contacts: [e] };
    else r[group].contacts.push(e);
    return r;
  }, {} as Record<string, { group: string; contacts: Contact[] }>);


  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <header className="px-6 pb-2 space-y-4 bg-background sticky top-0 z-30 pt-[80px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[34px] font-bold text-foreground tracking-tight">Contatos</h1>
          <button
            className="text-[#007AFF] hover:opacity-70 transition-opacity"
            onClick={() => history.push('/contacts/-1')}
          >
            <Plus size={28} strokeWidth={2} />
          </button>
        </div>
        <div className="-mx-4">
          <SearchContacts />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          <div key="self" className="px-6 border-b border-neutral-100 dark:border-neutral-800/50">
            <SelfContact number={myNumber} avatar={avatar_url} name={myName} />
          </div>

          <div className="flex flex-col">
            {Object.keys(groupedContacts)
              .sort()
              .map((letter) => (
                <div key={letter} className="flex flex-col">
                  <div className="sticky top-0 z-20 px-6 py-1 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md">
                    <h3 className="text-[14px] font-bold text-neutral-500 dark:text-neutral-400 uppercase">{letter}</h3>
                  </div>
                  <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800/50 px-6">
                    {groupedContacts[letter].contacts.map((contact: Contact) => (
                      <ContactItem key={contact.id} {...contact} />
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="py-20 text-center text-neutral-400 italic text-sm">
              {t('CONTACTS.NONE_FOUND', 'Nenhum contato encontrado') as string}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SelfContact = ({ number, avatar, name }: { number: string; avatar: string; name: string }) => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const [imgError, setImgError] = React.useState(false);

  // Check if avatar is a valid-looking URL or string
  const hasAvatar = avatar && avatar.length > 5 && !imgError;

  const copyNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClipboard(number);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'Número',
      }) as unknown as string,
      type: 'success',
    });
  };

  const shareLocal = (e: React.MouseEvent) => {
    e.stopPropagation();
    fetchNui(ContactEvents.LOCAL_SHARE);
  };

  return (
    <div className="py-3 flex items-center justify-between group active:opacity-60 transition-opacity cursor-pointer">
      <div className="flex items-center gap-4">
        {hasAvatar ? (
          <img
            src={avatar}
            className="h-[58px] w-[58px] rounded-full object-cover"
            alt="avatar"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-[58px] w-[58px] rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-500 dark:text-neutral-400 text-lg font-bold uppercase">
              {initials(name)}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[19px] font-semibold text-foreground leading-tight">
            {name}
          </span>
          <span className="text-[13px] text-neutral-500 font-normal">{number}</span>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ number, avatar, id, display }: Contact) => {
  const query = useQueryParams<{ referal: string }>();
  const { referal } = query;
  const { initializeCall } = useCall();
  const { goToConversation } = useMessages();
  const { findExistingConversation } = useContactActions();
  const myPhoneNumber = useMyPhoneNumber();
  const history = useHistory();

  const startCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    initializeCall(number.toString());
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const phoneNumber = number.toString();
    const conversation = findExistingConversation(myPhoneNumber, phoneNumber);
    if (conversation) return goToConversation(conversation);
    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  const detailUrl = referal
    ? `${referal}?contact=${encodeURIComponent(JSON.stringify({ number, id, display }))}`
    : `/contacts/${id}`;

  const [imgError, setImgError] = React.useState(false);
  const hasAvatar = avatar && avatar.length > 5 && !imgError;

  return (
    <Link to={detailUrl} className="py-2 flex items-center gap-3 w-full active:opacity-50 transition-opacity">
      <div className="shrink-0">
        {hasAvatar ? (
          <img
            src={avatar}
            className="h-9 w-9 rounded-full object-cover"
            alt={display}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase transition-colors">
              {initials(display)}
            </span>
          </div>
        )}
      </div>
      <span className="text-[17px] text-foreground font-medium truncate">{display}</span>
    </Link>
  );
};
