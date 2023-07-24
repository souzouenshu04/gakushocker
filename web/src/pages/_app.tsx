import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { Provider } from 'urql';
import { Layout } from '@/layout/Layout';
import { client } from '@/libs/graphql';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Provider value={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
