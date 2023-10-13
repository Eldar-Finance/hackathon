import { extendTheme, ThemeConfig  } from '@chakra-ui/react';
import { StepsTheme as Steps } from 'chakra-ui-steps';

export const theme = extendTheme({
  components: {
    Steps,
  },
  config: {
    initialColorMode: 'light', // or 'light'
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        minHeight: '100vh',
        overflowX: 'hidden',
        height: '100%',
      },
      '*': {
        '&::-webkit-scrollbar': {
          width: 1.5,
          borderRadius: 20,
          backgroundColor: 'black'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'white',
          borderRadius: 20,
        },
      },
    },
  },  
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1560px',
  },
});
