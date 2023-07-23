import {
  Heading,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { Order } from '../../generated/graphql';

const Dashboard = () => {
  const orders: Order[] = [];
  return (
    <>
      <Heading textAlign={'center'}>ダッシュボード</Heading>
      <TableContainer m={8}>
        <Table>
          <Thead>
            <Tr>
              <Th>注文ID</Th>
              <Th>注文内容</Th>
              <Th>価格</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order, index) => {
              return (
                <Tr key={index}>
                  <Td>{order.id}</Td>
                  <Td>{JSON.stringify(order.items)}</Td>
                  <Td>{order.total}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Dashboard;
