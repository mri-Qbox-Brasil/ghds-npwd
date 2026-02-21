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
import { useTranslation } from "react-i18next";
import { setClipboard } from "@os/phone/hooks";
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from "@utils/fetchNui";
import { cn } from '@utils/cn';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const history = useHistory();

  const groupedContacts = filteredContacts.reduce((r, e) => {
    const group = e.display.charAt(0).toUpperCase();
    if (!r[group]) r[group] = { group, contacts: [e] };
    else r[group].contacts.push(e);
    return r;
  }, {} as Record<string, { group: string; contacts: Contact[] }>);

  const myNumber = useMyPhoneNumber();
  const { avatar_url } = useTwitterProfileValue();

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <header className="px-4 py-4 space-y-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Contatos</h1>
          <NPWDButton
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-blue-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => history.push('/contacts/-1')}
          >
            <Plus size={24} />
          </NPWDButton>
        </div>
        <SearchContacts />
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <nav className="space-y-6" aria-label="Directory">
          <div key="self" className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 overflow-hidden">
            <List>
              <SelfContact number={myNumber} avatar={avatar_url} />
            </List>
          </div>

          <div className="space-y-4">
            {Object.keys(groupedContacts)
              .sort()
              .map((letter) => (
                <div key={letter} className="space-y-2">
                  <div className="sticky top-[108px] z-10 px-4 py-1.5 bg-background/95 backdrop-blur-sm">
                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest">{letter}</h3>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700/50 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50">
                    <List>
                      {groupedContacts[letter].contacts.map((contact: Contact) => (
                        <ContactItem key={contact.id} {...contact} />
                      ))}
                    </List>
                  </div>
                </div>
              ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="py-20 text-center text-neutral-400 italic text-sm">
              Nenhum contato encontrado
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

const SelfContact = ({ number, avatar }: { number: string; avatar: string }) => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();

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
    <ListItem className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} className="h-11 w-11 rounded-full border-2 border-white dark:border-neutral-700 shadow-sm" alt="avatar" />
        ) : (
          <div className="h-11 w-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-neutral-700">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">Eu</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold text-neutral-900 dark:text-white leading-none mb-1">
            Meu Cartão
          </span>
          <span className="text-xs text-neutral-400 font-medium">{number}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip title="Copiar número">
          <button
            onClick={copyNumber}
            className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-blue-500 transition-colors"
          >
            <Clipboard size={18} />
          </button>
        </Tooltip>
        <Tooltip title="Compartilhar por perto">
          <button
            onClick={shareLocal}
            className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-blue-500 transition-colors"
          >
            <UsersRound size={18} />
          </button>
        </Tooltip>
      </div>
    </ListItem>
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

  return (
    <ListItem className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors cursor-pointer active:scale-[0.99]">
      <Link to={detailUrl} className="p-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img src={avatar} className="h-10 w-10 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm" alt="avatar" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center border border-neutral-100 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-300 font-bold text-xs uppercase">{initials(display)}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900 dark:text-white leading-none mb-0.5">{display}</span>
            <span className="text-xs text-neutral-400 font-medium">{number}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startCall}
            className="p-2.5 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={handleMessage}
            className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </Link>
    </ListItem>
  );
};
