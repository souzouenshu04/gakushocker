import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Tfoot,
  Button,
  Box,
} from '@chakra-ui/react';
import { Product } from '../../../generated/graphql';
import { ProductInfo } from '@/components/admin/ProductInfo';

export const ProductInfoList = (productListProps: { list: Product[] }) => {
  return (
    <Box m={8}>
      <TableContainer>
        <Table variant={'striped'} size={'md'}>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>商品名</Th>
              <Th>値段</Th>
              <Th>在庫</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productListProps.list.map((product, index) => {
              return <ProductInfo key={index} {...product} />;
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>id</Th>
              <Th>商品名</Th>
              <Th>値段</Th>
              <Th>在庫</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <Button colorScheme="teal" variant={'outline'}>
        Save
      </Button>
    </Box>
  );
};
