import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  Alert,
} from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { ReservedUser } from '@/models/ReservedUser';
import { isSigninState, tokenState } from '@/recoil/signin';
import { userState } from '@/recoil/user';

const Signin = () => {
  let cookies = parseCookies();
  let client = axios.create({ withCredentials: true });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setSignin = useSetRecoilState(isSigninState);
  const setUser = useSetRecoilState(userState);
  const setToken = useSetRecoilState(tokenState);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [isFailed, setIsFailed] = useState(false);
  const auth = () => {
    client
      .post(`${API_URL}/auth/signin`, {
        email: email,
        password: password,
      })
      .then((res: AxiosResponse<ReservedUser>) => {
        if (res.status === 200) {
          setSignin(true);
          console.log(res.data);
          setUser(res.data);
          setToken(res.data.token);
          setCookie(cookies, 'token', res.data.token, {
            path: '/',
          });
          setCookie(cookies, 'email', res.data.email, {
            path: '/',
          });
          if (res.data.isAdmin) {
            router.push('/admin');
          }
          router.push('/');
        } else {
          setIsFailed(true);
        }
      });
  };

  return (
    <>
      <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'white:800'}>
        <Stack
          spacing={8}
          mx={'auto'}
          maxW={'lg'}
          py={12}
          px={6}
          align={'center'}
        >
          <Heading fontSize={'4xl'}>サインイン</Heading>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Link color={'blue.400'} href={'/auth/signup'}>
                    サインアップ
                  </Link>
                </Stack>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  onClick={() => auth()}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      {isFailed && <Alert status={'error'}>サインインに失敗しました</Alert>}
    </>
  );
};

export default Signin;
