import { ChannelItemProps, ChannelMember, ChannelMessageProps } from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';

export const MockChannels: ChannelItemProps[] = [
  {
    id: 1,
    label: 'mrilegal',
    identifier: 'mrilegal2024',
    lastMessage: 'mano tenho uma creative pura...',
    owner: '111-1134',
  },
  {
    id: 2,
    label: 'mydrugs',
    identifier: 'becoesc',
    lastMessage: 'alguem tem vrp pra trocar?',
    owner: '1234567',
  },
  {
    id: 3,
    label: 'monkeys',
    identifier: 'lixao99',
    lastMessage: 'esse servidor é puro leak',
    owner: '1234567',
  },
];

export const MockChannelMembers: ChannelMember[] = [
  {
    phoneNumber: '23423',
    identifier: 'sklfjsdklfd',
    channelId: 1,
  },
  {
    phoneNumber: '5534542324',
    identifier: 'sdfaffsdf',
    channelId: 1,
  },
  {
    // me
    phoneNumber: '111-1134',
    identifier: 'iofjsdklafjdsfjklfjklas',
    channelId: 1,
  },
];

export const MockChannelMessages: ChannelMessageProps[] = [
  {
    id: 1,
    message: 'ei mano, tu tem aquela creative pura? tô precisando de uma dose pesada pra montar meu servidor',
    isMine: false,
    identifier: '234',
    createdAt: 1651357807,
    isImage: false,
  },
  {
    id: 2,
    message: 'tenho sim irmão... acabou de chegar do fornecedor. creative 2.0 direto do lab, sem corte nenhum 🔥',
    isMine: true,
    createdAt: 1651357907,
    identifier: '234',
    isImage: false,
  },
  {
    id: 3,
    message: 'e aquela vrp?? mano, me disseram que tem uma vrp 9.99 rodando por aí, pura sem mistura',
    isMine: false,
    identifier: '345',
    createdAt: 1651358007,
    isImage: false,
  },
  {
    id: 4,
    message: 'vrp é droga pesada demais mano... quem usa uma vez não larga mais. vicia. teu servidor nunca mais vai ser o mesmo',
    isMine: true,
    identifier: '234',
    createdAt: 1651358107,
    isImage: false,
  },
  {
    id: 5,
    message: 'kkkkkk real, metade dos servidores br são dependentes de vrp vazada. a podridão do fivem é isso aí',
    isMine: false,
    identifier: '456',
    createdAt: 1651358207,
    isImage: false,
  },
  {
    id: 6,
    message: 'mano sem zoeira, ontem peguei uma base creative cortada com esx... quase perdi meu hd, veio com minerador junto 💀',
    isMine: false,
    identifier: '345',
    createdAt: 1651358307,
    isImage: false,
  },
  {
    id: 7,
    message: 'KKKKK é por isso que só pego do fornecedor de confiança. material testado, sem backdoor, sem rato',
    isMine: true,
    identifier: '234',
    createdAt: 1651358407,
    isImage: false,
  },
  {
    id: 8,
    message: 'o problema é que todo mundo quer abrir servidor mas ninguém quer pagar dev... aí recorre ao beco escuro do discord pra pegar leak',
    isMine: false,
    identifier: '234',
    createdAt: 1651358507,
    isImage: false,
  },
  {
    id: 9,
    message: 'e o pior: tem maluco vendendo leak como se fosse original 😭 o cara pega uma vrp vazada, muda a cor do hud e vende por 500 conto',
    isMine: true,
    identifier: '234',
    createdAt: 1651358607,
    isImage: false,
  },
  {
    id: 10,
    message: 'olha essa belezinha aqui mano... base creative COMPLETA no precinho, tá saindo quase de graça. só chegar no pv 👀',
    isMine: false,
    identifier: '345',
    createdAt: 1651358707,
    isImage: false,
  },
  {
    id: 11,
    message: 'https://recicla.club/wp-content/uploads/2021/11/residuo-lixo-rejeito.png',
    isMine: false,
    identifier: '345',
    createdAt: 1651358807,
    isImage: true,
  },
];

export const MockChannelMessagesResp: ServerPromiseResp<ChannelMessageProps[]> = {
  data: MockChannelMessages,
  status: 'ok',
};
