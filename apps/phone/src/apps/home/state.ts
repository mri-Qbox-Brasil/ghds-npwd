import { atom, useRecoilState } from 'recoil';

/**
 * Estado global do jiggle mode (modo de edição da Home Screen).
 * Compartilhado entre Home.tsx e Dock.tsx para habilitar drag no Dock.
 */
export const jigglingState = atom<boolean>({
    key: 'home.jiggling',
    default: false,
});

export const useJiggling = () => useRecoilState(jigglingState);
