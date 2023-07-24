import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { MutableSnapshot, RecoilRoot } from 'recoil';
import { OrderTable } from '@/components/OrderTable';
import { totalState, cartItemState, cartIDState } from '@/recoil/cart';

export default {
  title: 'OrderTable',
  components: OrderTable,
} as ComponentMeta<typeof OrderTable>;

const initializeOrderStates = ({ set }: MutableSnapshot) => {
  set(totalState, 640);
  set(cartIDState, [1, 2]);
  set(cartItemState(1), {
    productId: 1,
    quantity: 1,
    name: 'カツ丼',
    price: 360,
  });
  set(cartItemState(2), {
    productId: 2,
    quantity: 1,
    name: '肉うどん',
    price: 300,
  });
};

export const OrderedItemsTable: ComponentStory<typeof OrderTable> = () => (
  <RecoilRoot initializeState={initializeOrderStates}>
    <OrderTable />
  </RecoilRoot>
);
