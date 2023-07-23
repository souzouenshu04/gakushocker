import {
  Box,
  Avatar,
  Flex,
  Link,
  Menu,
  MenuButton,
  Button,
  Center,
  MenuList,
  MenuDivider,
  MenuItem,
  Spacer,
  ButtonGroup,
  Heading,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { BiCart } from 'react-icons/bi';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { isSigninState, tokenState } from '@/recoil/signin';
import { userState } from '@/recoil/user';

export const Header = () => {
  let [isSignin, setIsSignin] = useRecoilState(isSigninState);
  let setToken = useSetRecoilState(tokenState);
  let user = useRecoilValue(userState);
  const router = useRouter();

  const resetTokenState = useResetRecoilState(tokenState);
  const resetIsSigninState = useResetRecoilState(isSigninState);
  const resetUserState = useResetRecoilState(userState);
  const onSignOutClicked = () => {
    resetTokenState();
    resetIsSigninState();
    resetUserState();
    destroyCookie(null, 'token', {
      path: '/',
    });
    destroyCookie(null, 'email', {
      path: '/',
    });
  };

  const onCartClicked = () => {
    router.push('/cart');
  };
  return (
    <Box w="100%" px={4}>
      <Flex alignItems={'center'} justifyItems={'space-between'} h={16} gap={2}>
        <Box>
          <Heading as={Link} href={'/'}>
            学ショッカー
          </Heading>
        </Box>
        <Spacer />
        {isSignin ? (
          <Flex gap={2}>
            <Icon as={BiCart} onClick={onCartClicked} w={8} h={8}>
              カートを開く
            </Icon>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar size={'sm'} src={'https://bit.ly/broken-link'} />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <br />
                <Center>
                  <Avatar size={'2xl'} src={'https://bit.ly/broken-link'} />
                </Center>
                <br />
                <Center>
                  <Stack>
                    <p>ユーザーID: {user.id}</p>
                    <p>{user.displayName}</p>
                    <p>{user.point} pt</p>
                  </Stack>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem onClick={() => router.push('/dashboard')}>
                  ダッシュボード
                </MenuItem>
                <MenuItem onClick={() => onSignOutClicked()}>
                  サインアウト
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <ButtonGroup gap={2}>
            <Button as={Link} href={'/auth/signin'} colorScheme={'teal'}>
              サインイン
            </Button>
            <Button as={Link} href={'/auth/signup'} colorScheme={'teal'}>
              サインアップ
            </Button>
          </ButtonGroup>
        )}
      </Flex>
    </Box>
  );
};
