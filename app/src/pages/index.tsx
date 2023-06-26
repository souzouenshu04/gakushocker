import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  Container,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { useEffect, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQuery } from 'urql';
import {
  GetUserInfoDocument,
  ListProductDocument,
  Product,
} from '../../generated/graphql';
import { MenuItem } from '@/components/MenuItem';
import { isSigninState, tokenState } from '@/recoil/signin';
import { userState } from '@/recoil/user';

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  let cookies = parseCookies(ctx);
  let token = cookies.token;
  let email = cookies.email;
  return {
    props: {
      user: {
        token: !token ? '' : token,
        email: !email ? '' : email,
      },
    },
  };
};

const Home = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let { token, email } = user;
  const setToken = useSetRecoilState(tokenState);

  const setUser = useSetRecoilState(userState);
  const setIsSignin = useSetRecoilState(isSigninState);
  let [menuQueryResult, _reExecuteMenuQuery] = useQuery({
    query: ListProductDocument,
    context: useMemo(
        () => ({
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }),
        [token]
    ),
  });
  let [getUserInfoQuery, _reExecuteGetUserInfoQuery] = useQuery({
    query: GetUserInfoDocument,
    context: useMemo(
      () => ({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }),
      [token]
    ),
    variables: { email },
  });
  const { data, fetching, error } = menuQueryResult;

  useEffect(() => {
    setToken(token);
    if (getUserInfoQuery.data) {
      setUser(getUserInfoQuery.data.findUserByEmail);
      setIsSignin(true);
    }
  }, [getUserInfoQuery.data, setIsSignin, setUser]);
  return (
    <>
      <Head>
        <title>学ショッカー</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading textAlign={'center'}>メニュー</Heading>
        {fetching && (
          <CircularProgress
            isIndeterminate
            color="green.400"
          ></CircularProgress>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {data && (
          <Container maxW="8xl" marginTop={'4'}>
            <SimpleGrid minChildWidth={'416px'} spacing={6}>
              {data.listProduct.map((product: Product) => {
                return <MenuItem {...product} key={product.id} />;
              })}
            </SimpleGrid>
          </Container>
        )}
      </main>
    </>
  );
};

export default Home;
