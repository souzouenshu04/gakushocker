import {
  Table,
  TableContainer,
  Tr,
  Th,
  Td,
  Thead,
  Tbody,
  Text,
  Center,
  Button,
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/recoil/cart';

const Cart = () => {
  const cart = useRecoilValue(cartState);
  const router = useRouter();
  return (
    <>
      {cart.length != 0 ? (
        <>
          <TableContainer m={8}>
            <Table>
              <Thead>
                <Tr>
                  <Th>商品名</Th>
                  <Th>価格</Th>
                  <Th>数</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cart.map((product, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{product.name}</Td>
                      <Td>{product.price}</Td>
                      <Td>{product.quantity}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <Center>
            <Button
              variant={'ghost'}
              colorScheme={'teal'}
              onClick={() => router.push('/payment')}
            >
              購入へ進む
            </Button>
          </Center>
        </>
      ) : (
        <Container centerContent>
          <Text fontSize={'2xl'}>カートが空です</Text>
          <Button onClick={() => router.push('/')}>ショッピングを続ける</Button>
        </Container>
      )}
    </>
  );
};

export default Cart;
