import { SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Order } from '../../../generated/graphql';
import { OrderItem } from '@/components/admin/OrderItem';
import { Message } from '@/models/Message';
import { isSigninState } from '@/recoil/signin';

const Orders = () => {
  const isSignin = useRecoilValue(isSigninState);
  const router = useRouter();
  const ws = useRef<WebSocket>(undefined as any);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080/ws');
    ws.current.onopen = () => {
      let firstMessage: Message = {
        type: 'Connect',
        userId: 0,
      };
      if (ws.current.readyState) {
        ws.current.send(JSON.stringify(firstMessage));
      }
    };
    ws.current.onmessage = (msg: MessageEvent<string>) => {
      let receive = JSON.parse(msg.data);
      if (receive.id) {
        setOrders((prevState) =>
          orders.includes(receive) ? prevState : [...prevState, receive]
        );
      }
    };
  }, [orders]);

  useEffect(() => {
    if (!isSignin) {
      router.push('/');
    }
  }, [isSignin, router]);

  const orderComplete = (id: any, userId: number) => {
    setOrders((prevState) => prevState.filter((o) => o.id !== id));
    let completeMessage: Message = {
      type: 'SetOrderInfo',
      userId,
    };
    ws.current.send(JSON.stringify(completeMessage));
  };

  return (
    <>
      <SimpleGrid>
        {orders.map((order, index) => {
          return (
            <OrderItem order={order} key={index} onComplete={orderComplete} />
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default Orders;
