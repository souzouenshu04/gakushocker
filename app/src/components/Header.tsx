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
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { Cart } from '@/components/Cart';
import { isSigninState } from '@/recoil/signin';
import { userState } from '@/recoil/user';

export const Header = () => {
  let signin = useRecoilValue(isSigninState);
  let user = useRecoilValue(userState);
  return (
    <Box w="100%" px={4}>
      <Flex alignItems={'center'} justifyItems={'space-between'} h={16} gap={2}>
        <Box>
          <Heading>学ショッカー</Heading>
        </Box>
        <Spacer />
        {signin ? (
          <Flex gap={2}>
            <Cart />
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
                    <p>{user.displayName}</p>
                    <p>{user.point} pt</p>
                  </Stack>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>ダッシュボード</MenuItem>
                <MenuItem>サインアウト</MenuItem>
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
