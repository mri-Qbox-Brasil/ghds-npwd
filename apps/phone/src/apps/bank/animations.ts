import { makeStyles } from '@mui/styles';

export const AnimationStyles = makeStyles({
  input: {
    '--s': '40px', // ajuste esse valor para controlar o tamanho

    height: 'var(--s)',
    aspectRatio: '2.5',
    width: 'auto',
    borderRadius: 'var(--s)',
    padding: 'calc(var(--s)/10)',
    margin: 'calc(var(--s)/2)',
    cursor: 'pointer',
    background:
      'radial-gradient(farthest-side, #15202a 96%, transparent) var(--_p,0%) / var(--s) content-box no-repeat, var(--_c, #ff7a7a)',
    boxSizing: 'content-box',
    transformOrigin: 'calc(3*var(--s)/5) 50%',
    transition:
      'transform cubic-bezier(0,300,1,300) .5s, background .3s .1s ease-in',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    '&:checked': {
      '--_c': '#85ff7a',
      '--_p': '100%',
      transformOrigin: 'calc(100% - 3*var(--s)/5) 50%',
      transform: 'rotate(0.1deg)',
    },
  },
  body: {
    background: '#15202a',
    margin: 0,
    height: '100vh',
    display: 'grid',
    placeContent: 'center',
    placeItems: 'center',
  },
});

export default AnimationStyles;
