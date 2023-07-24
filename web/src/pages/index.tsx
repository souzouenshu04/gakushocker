import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  Container,
  Heading,
  SimpleGrid,
  Center,
  Text,
} from '@chakra-ui/react';
import type { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useMemo } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
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
  let cart = cookies.cart;
  return {
    props: {
      userInfo: {
        token: !token ? '' : token,
        email: !email ? '' : email,
        cart: !cart ? [] : JSON.parse(cart),
      },
    },
  };
};

const Home = ({
  userInfo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let { token, email, cart } = userInfo;
  const setToken = useSetRecoilState(tokenState);
  let router = useRouter();
  const setUser = useSetRecoilState(userState);
  const [isSignin, setIsSignin] = useRecoilState(isSigninState);
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
    if (getUserInfoQuery.error) {
      router.push('/auth/signin');
    }
    if (getUserInfoQuery.data) {
      setUser(getUserInfoQuery.data.findUserByEmail);
      setIsSignin(true);
      if (getUserInfoQuery.data.findUserByEmail.isAdmin) {
        router.push('/admin');
      }
    }
  }, [getUserInfoQuery.data, router, setIsSignin, setToken, setUser, token]);

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
          <Center>
            <CircularProgress
              isIndeterminate
              color="green.400"
            ></CircularProgress>
          </Center>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        {data &&
          (isSignin ? (
            <Container maxW="8xl" marginTop={'4'}>
              <SimpleGrid minChildWidth={'416px'} spacing={6}>
                {data.listProduct.map((product: Product) => {
                  return <MenuItem {...product} key={product.id} />;
                })}
              </SimpleGrid>
            </Container>
          ) : (
            <Center m={8}>
              <Text fontSize={'2xl'}>サインインしてください</Text>
            </Center>
          ))}
      </main>
    </>
  );
};

export default Home;
