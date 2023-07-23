import { Image, Button, Container, Box, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Thanks = () => {
  let router = useRouter();
  const onClick = () => {
    router.push('/');
  };
  return (
    <>
      <Container boxSize={'lg'} centerContent={true}>
        <Stack>
          <Image src={'/thanks.png'} alt="thanks" m={4}></Image>
          <Button
            onClick={() => onClick()}
            variant={'ghost'}
            colorScheme={'teal'}
          >
            トップへ戻る
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Thanks;
