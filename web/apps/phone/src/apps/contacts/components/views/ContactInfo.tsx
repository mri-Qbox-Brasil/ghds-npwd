import React, { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import useMessages from '../../../messages/hooks/useMessages';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { NPWDInput } from '@ui/components';
import { NPWDButton } from '@npwd/keyos';
import { ContactsDatabaseLimits } from '@typings/contact';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { SendMoneyModal } from '../../components/modals/SendMoney';
import { ArrowLeft, HelpingHand, MessageCircle, Phone, Trash2 } from 'lucide-react';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useModal } from '@apps/contacts/hooks/useModal';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/cn';
import { initials } from '@utils/misc';

interface ContactInfoRouteParams {
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
  name?: string;
  avatar?: string;
}

const ContactsInfoPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<ContactInfoRouteParams>();
  const {
    addNumber,
    referal: referral,
    avatar: avatarParam,
    name: nameParam,
  } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/contacts',
  });

  const { contactPayModal, setContactPayModal } = useModal();
  const { getContact, findExistingConversation } = useContactActions();
  const { updateContact, addNewContact, deleteContact } = useContactsAPI();
  const { initializeCall } = useCall();
  const myPhoneNumber = useMyPhoneNumber();
  const { goToConversation } = useMessages();

  const contact = getContact(parseInt(id));
  const isNew = !contact;

  const [isEditing, setIsEditing] = useState(isNew);
  const [name, setName] = useState(contact?.display ?? '');
  const [number, setNumber] = useState(contact?.number ?? '');
  const [avatar, setAvatar] = useState(contact?.avatar ?? '');

  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > ContactsDatabaseLimits.display) return;
    setName(e.target.value);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length > ContactsDatabaseLimits.avatar) return;
    setAvatar(e.target.value);
  };

  const handleContactAdd = () => {
    addNewContact({ display: name, number, avatar }, referral);
  };

  const startCall = () => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number.toString());
  };

  const handleMessage = () => {
    const phoneNumber = number.toString();
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    const conversation = findExistingConversation(myPhoneNumber, phoneNumber);
    if (conversation) {
      return goToConversation(conversation);
    }

    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  const handleContactDelete = () => {
    if (!contact?.id) return;
    deleteContact({ id: contact.id });
  };

  const handleContactUpdate = () => {
    if (!contact?.id) return;
    updateContact({ id: contact.id, number, avatar, display: name });
    setIsEditing(false);
  };

  const openpayModal = () => {
    if (ResourceConfig?.general?.useResourceIntegration && ResourceConfig?.contacts?.frameworkPay) {
      setContactPayModal(true);
    }
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatarParam, nameParam]);

  if (!ResourceConfig) return null;

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7] dark:bg-black animate-in fade-in duration-300">
      <SendMoneyModal
        open={contactPayModal}
        closeModal={() => setContactPayModal(false)}
        openContact={number}
      />

      <header className="flex h-24 shrink-0 items-end justify-between px-2 pb-3 bg-[#F2F2F7]/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-transparent pt-[44px]">
        <button
          onClick={() => {
            if (isEditing && !isNew) {
              setIsEditing(false);
              setName(contact?.display ?? '');
              setNumber(contact?.number ?? '');
              setAvatar(contact?.avatar ?? '');
            } else {
              history.goBack();
            }
          }}
          className="flex items-center text-[#007AFF] hover:opacity-70 transition-opacity font-normal text-[17px] pl-1"
        >
          {!isEditing || isNew ? (
            <>
              <ArrowLeft size={26} strokeWidth={1.5} className="-ml-1 mr-0.5" />
              <span>{t('GENERIC.BACK', 'Buscar') as string}</span>
            </>
          ) : (
            <span className="pl-2">Cancelar</span>
          )}
        </button>
        <button
          onClick={() => {
            if (isEditing) {
              if (isNew) handleContactAdd();
              else handleContactUpdate();
            } else {
              setIsEditing(true);
            }
          }}
          className="text-[#007AFF] font-semibold text-[17px] pr-2 hover:opacity-70 transition-opacity"
        >
          {isEditing ? (isNew ? 'Adicionar' : 'Salvar') : 'Editar'}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-20 custom-scrollbar">
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                className="h-[104px] w-[104px] rounded-full object-cover"
                alt={'avatar'}
              />
            ) : (
              <div className="h-[104px] w-[104px] rounded-full bg-[#8E8E93] flex items-center justify-center">
                <span className="text-[40px] text-white uppercase font-normal tracking-wide">
                  {initials(name || "?")}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-[28px] mt-1 leading-tight font-normal text-foreground text-center px-4 break-words">
            {name || "Novo Contato"}
          </h2>
        </div>

        {!isNew && !isEditing && (
          <div className="flex items-center justify-center gap-2 w-full px-1">
            <ContactAction
              onClick={handleMessage}
              icon={<MessageCircle size={20} fill="currentColor" />}
              label="mensagem"
            />
            <ContactAction
              onClick={startCall}
              icon={<Phone size={20} fill="currentColor" />}
              label="ligar"
            />
            {ResourceConfig?.general?.useResourceIntegration && ResourceConfig?.contacts?.frameworkPay && (
              <ContactAction
                onClick={openpayModal}
                icon={<HelpingHand size={20} />}
                label="pagar"
              />
            )}
          </div>
        )}

        <div className="space-y-4 pt-2">
          {isEditing && (
            <div className="bg-[#FFFFFF] dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden">
              <div className="flex flex-col px-4 py-2 border-transparent">
                <span className="text-[12px] text-foreground font-normal mb-0.5">Nome</span>
                <NPWDInput
                  value={name}
                  onChange={handleDisplayChange}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 rounded-none text-[17px] text-foreground font-normal"
                  placeholder="Nome..."
                />
              </div>
            </div>
          )}

          <div className="bg-[#FFFFFF] dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden">
            <div className="flex flex-col px-4 py-2 border-transparent">
              <span className="text-[12px] text-foreground font-normal mb-0.5">celular</span>
              {isEditing ? (
                <NPWDInput
                  value={number}
                  onChange={handleNumberChange}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 rounded-none text-[17px] text-[#007AFF]"
                  placeholder="Número celular"
                />
              ) : (
                <span className="w-full bg-transparent border-none p-0 focus:ring-0 text-[17px] text-[#007AFF] pt-0.5 pb-1 select-text">
                  {number || "Sem Número"}
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden">
            <div className="flex flex-col px-4 py-2 border-transparent">
              <span className="text-[12px] text-foreground font-normal mb-0.5">URL do avatar</span>
              {isEditing ? (
                <NPWDInput
                  value={avatar}
                  onChange={handleAvatarChange}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 rounded-none text-[17px] text-[#007AFF] truncate"
                  placeholder="https://"
                />
              ) : (
                <span className="w-full bg-transparent border-none p-0 focus:ring-0 text-[17px] text-[#007AFF] pt-0.5 pb-1 truncate select-text">
                  {avatar || "Nenhuma Imagem"}
                </span>
              )}
            </div>
          </div>

          {!isNew && isEditing && (
            <div className="bg-[#FFFFFF] dark:bg-[#1C1C1E] rounded-[10px] overflow-hidden mt-6">
              <button
                onClick={handleContactDelete}
                className="w-full text-left px-4 py-3 text-[17px] text-[#FF3B30] bg-transparent active:bg-neutral-200/50 dark:active:bg-neutral-800 transition-colors"
              >
                Apagar Contato
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ContactActionProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  label: string;
}

export const ContactAction: React.FC<ContactActionProps> = ({ icon, onClick, className, label }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 h-[56px] flex-col items-center justify-center gap-1 rounded-[10px] bg-[#FFFFFF] dark:bg-[#1C1C1E] transition-all active:opacity-60 shadow-sm',
        className,
      )}
    >
      <div className="text-[#007AFF]">
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide text-[#007AFF] capitalize">
        {label === 'excluir' ? 'Excluir' : label}
      </span>
    </button>
  );
};

export default ContactsInfoPage;
