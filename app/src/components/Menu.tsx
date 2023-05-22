import {
  SimpleGrid,
  Container,
  Heading,
  CircularProgress,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'urql';
import { Product, ListProductDocument } from '../../generated/graphql';
import { MenuItem } from '@/components/MenuItem';
import { userState } from '@/recoil/user';

export const Menu = () => {
  let [menuQureyResult, reExecuteMenuQuery] = useQuery({
    query: ListProductDocument,
  });
  let user = useRecoilValue(userState);
  useEffect(() => {
    reExecuteMenuQuery();
  }, [user]);
  const { data, fetching, error } = menuQureyResult;
  if (fetching) {
    return (
      <CircularProgress isIndeterminate color="green.400"></CircularProgress>
    );
  }
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <>
      <Heading textAlign={'center'}>メニュー</Heading>
      <Container maxW="8xl" marginTop={'4'}>
        <SimpleGrid minChildWidth={'416px'} spacing={6}>
          {data.listProduct.map((product: Product) => {
            return <MenuItem {...product} key={product.id} />;
          })}
        </SimpleGrid>
      </Container>
    </>
  );
};
