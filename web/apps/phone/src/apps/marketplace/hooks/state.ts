import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ServerPromiseResp } from '@typings/common';
import {
  MarketplaceEvents,
  MarketplaceListing,
  MarketplaceListingBase,
} from '@typings/marketplace';
import fetchNui from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';

const defaultData: MarketplaceListing[] = [
  {
    id: 1,
    name: 'Carlos Mendes',
    number: '555-0142',
    username: 'carlos_m',
    title: 'Dodge Charger 2019 - Impecável',
    description: 'Carro em perfeito estado, revisado recentemente. Pintura original preta fosca, rodas aro 20. Aceito propostas.',
    url: 'https://picsum.photos/id/111/600/400',
  },
  {
    id: 2,
    name: 'Julia Santos',
    number: '555-0287',
    username: 'ju_santos',
    title: 'Apartamento em Vinewood Hills',
    description: 'Vista panorâmica para a cidade, 2 quartos, garagem para 3 carros. Mobiliado. Aluguel mensal ou venda.',
    url: 'https://picsum.photos/id/164/600/400',
  },
  {
    id: 3,
    name: 'Rafael Costa',
    number: '555-0391',
    username: 'rafa_c',
    title: 'MacBook Pro M2 - Seminovo',
    description: 'Usado por 3 meses, com caixa e carregador original. 16GB RAM, 512GB SSD. Sem marcas de uso.',
    url: 'https://picsum.photos/id/180/600/400',
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    number: '555-0456',
    username: 'ana_oli',
    title: 'Coleção de Tênis Nike & Jordan',
    description: 'Vendo coleção completa com 8 pares. Tamanho 42. Todos originais com nota fiscal. Vendo separado também.',
    url: 'https://picsum.photos/id/21/600/400',
  },
  {
    id: 5,
    name: 'Pedro Lima',
    number: '555-0523',
    username: 'pedro_l',
    title: 'Bike Elétrica - 1 mês de uso',
    description: 'Autonomia de 60km, carregador rápido incluso. Perfeita para o dia a dia na cidade. Motivo: mudança.',
    url: 'https://picsum.photos/id/146/600/400',
  },
];

export const listingState = atom<MarketplaceListing[]>({
  key: 'listings',
  default: selector({
    key: 'defaultListings',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<MarketplaceListing[]>>(
          MarketplaceEvents.FETCH_LISTING,
        );
        return resp.data;
      } catch (e) {
        if (isEnvBrowser()) return defaultData;
        console.error(e);
        return [];
      }
    },
  }),
});

export const formState = atom<MarketplaceListingBase>({
  key: 'form',
  default: {
    title: '',
    description: '',
    url: '',
  },
});

export const useListingValue = () => useRecoilValue(listingState);
export const useSetListings = () => useSetRecoilState(listingState);
export const useListings = () => useRecoilState(listingState);

export const useFormValue = () => useRecoilValue(formState);
export const useSetForm = () => useSetRecoilState(formState);
export const useForm = () => useRecoilState(formState);
