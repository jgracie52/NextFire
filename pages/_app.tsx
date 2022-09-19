import '../styles/globals.css'
import NavBar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'
import { MantineProvider, ColorSchemeProvider,
  ColorScheme,} from '@mantine/core'
import Head from 'next/head';
import { HeaderActionProps } from '../components/AppHeader'
import AppHeader from '../components/AppHeader';
import { FooterSimpleProps } from '../components/Footer';
import AppFooter from '../components/Footer';
import { useState } from 'react';

const MainLinks:HeaderActionProps = {
  links:[
    {
      link: '/about',
      label: 'Our Story',
      links: []
    },
    {
      link: '/learn',
      label: 'Learn',
      links: [
        {
          link:'/learn/documentation',
          label: 'Documentation',
        },
        {
          link:'/learn/resources',
          label: 'Resources',
        }
      ]
    },
    {
      link: '/admin',
      label: 'Write',
      links: []
    },
    {
      link: '/help',
      label: 'Help',
      links: []
    }
]
}

const FooterLinks:FooterSimpleProps = {
  links:[
    {
      link:'/contact',
      label:'Contact'
    },
    {
      link:'/privacy',
      label:'Privacy'
    },
    {
      link:'/blog',
      label:'Blog'
    },
    {
      link:'/careers',
      label:'Careers'
    }
  ]
}

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>NewFlame</title>
        <link rel="icon" href="/logo-flame.svg" type="image/svg+xml"></link>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ColorSchemeProvider 
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: colorScheme,
            colors: {
              brand: ['#FFE0E3', '#FFE0E3', '#FFC7CA', '#FFAEB1', '#FF9497', '#FF7B7E', '#EC6164', '#e95f69', '#e65d6e','#e25b72' ],
              background: ['#F8EFED']
            },
            primaryColor: 'brand',
          }}
        >
          <UserContext.Provider value={userData}>
            <AppHeader  links={MainLinks.links}/>
            <Component {...pageProps} />
            <Toaster /> 
            <AppFooter links={FooterLinks.links}/>
          </UserContext.Provider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
    );
}

export default MyApp
