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

  const [name, setName] = useState(contact?.display ?? '');
  const [number, setNumber] = useState(contact?.number ?? '');
  const [avatar, setAvatar] = useState(
    contact?.avatar ?? 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png',
  );

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

  const isNew = !contact;

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      <SendMoneyModal
        open={contactPayModal}
        closeModal={() => setContactPayModal(false)}
        openContact={number}
      />

      <header className="flex h-32 shrink-0 items-center px-4 bg-background/80 backdrop-blur-md sticky top-0 z-10 border-b border-transparent pt-[80px]">
        <button
          onClick={() => history.goBack()}
          className="flex items-center text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-xl transition-colors font-medium"
        >
          <ArrowLeft size={24} className="mr-1" />
          <span>{t('GENERIC_BACK') as string}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 pb-32">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                className="h-28 w-28 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl"
                alt={'avatar'}
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center border-4 border-white dark:border-neutral-800 shadow-xl">
                <span className="text-4xl font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  {initials(name || "?")}
                </span>
              </div>
            )}
            {!isNew && (
              <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-neutral-800 shadow-lg">
                <HelpingHand size={16} />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center px-4 break-all">
            {name || "Novo Contato"}
          </h2>
        </div>

        {!isNew && (
          <div className="flex items-center justify-center gap-6">
            <ContactAction
              onClick={startCall}
              icon={<Phone size={22} />}
              className="bg-green-500 text-white shadow-green-500/20"
              label="Ligar"
            />
            <ContactAction
              onClick={handleMessage}
              icon={<MessageCircle size={22} />}
              className="bg-blue-500 text-white shadow-blue-500/20"
              label="Mensagem"
            />
            {ResourceConfig?.general?.useResourceIntegration && ResourceConfig?.contacts?.frameworkPay && (
              <ContactAction
                onClick={openpayModal}
                icon={<HelpingHand size={22} />}
                className="bg-amber-500 text-white shadow-amber-500/20"
                label="Pagar"
              />
            )}
            <ContactAction
              onClick={handleContactDelete}
              icon={<Trash2 size={22} />}
              className="bg-red-500 text-white shadow-red-500/20"
              label="Excluir"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 px-1">
              Informações
            </h3>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700/50">
              <div className="p-4 space-y-1">
                <label className="text-xs text-neutral-500 dark:text-neutral-400">{t('CONTACTS.FORM_NAME', 'Nome') as string}</label>
                <NPWDInput
                  value={name}
                  onChange={handleDisplayChange}
                  className="h-10 bg-transparent border-none p-0 focus:ring-0 text-base"
                  placeholder="Nome completo"
                />
              </div>
              <div className="p-4 space-y-1">
                <label className="text-xs text-neutral-500 dark:text-neutral-400">{t('CONTACTS.FORM_NUMBER', 'Número') as string}</label>
                <NPWDInput
                  value={number}
                  onChange={handleNumberChange}
                  className="h-10 bg-transparent border-none p-0 focus:ring-0 text-base"
                  placeholder="Número de telefone"
                />
              </div>
              <div className="p-4 space-y-1">
                <label className="text-xs text-neutral-500 dark:text-neutral-400">{t('CONTACTS.FORM_AVATAR', 'Foto') as string}</label>
                <NPWDInput
                  value={avatar}
                  onChange={handleAvatarChange}
                  className="h-10 bg-transparent border-none p-0 focus:ring-0 text-base italic text-sm text-blue-500"
                  placeholder="URL da imagem"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="p-6 bg-background/80 backdrop-blur-md border-t border-neutral-100 dark:border-neutral-800 fixed bottom-0 w-full z-10 lg:w-[350px]">
        <NPWDButton
          onClick={isNew ? handleContactAdd : handleContactUpdate}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          size="lg"
        >
          {isNew ? t('GENERIC.ADD', 'Adicionar') as string : t('GENERIC.UPDATE', 'Salvar') as string}
        </NPWDButton>
      </footer>
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
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={onClick}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl transition-all active:scale-90 shadow-md',
          className,
        )}
      >
        {icon}
      </button>
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{label}</span>
    </div>
  );
};

export default ContactsInfoPage;
