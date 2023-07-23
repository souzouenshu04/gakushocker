import { Box, ListItem, Text, UnorderedList, Button } from '@chakra-ui/react';
import { Order } from '../../../generated/graphql';

export const OrderItem = (orderItemProps: {
  order: Order;
  onComplete: (id: any, userId: number) => void;
}) => {
  const rmOrder = (id: any) => {
    orderItemProps.onComplete(id, orderItemProps.order.userId);
  };
  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" p={4} m={8}>
        <Text>{orderItemProps.order.id}</Text>
        <UnorderedList>
          {orderItemProps.order.items.map((orderItem, index) => {
            return (
              <ListItem key={index}>
                {orderItem.name} × {orderItem.quantity}
              </ListItem>
            );
          })}
        </UnorderedList>
        <Button
          colorScheme={'teal'}
          variant={'ghost'}
          onClick={() => rmOrder(orderItemProps.order.id)}
        >
          完成
        </Button>
      </Box>
    </>
  );
};
