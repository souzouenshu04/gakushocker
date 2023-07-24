import { Heading, Text, Container } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Message } from '@/models/Message';

const Notify = () => {
  const ws = useRef<WebSocket>(undefined as any);
  const [completeOrders, setCompleteOrders] = useState<number[]>([]);
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
      if (receive.type) {
        if (receive.type === 'SetOrderInfo') {
          console.log(receive);
          setCompleteOrders((prevState) =>
            prevState.includes(receive.userId)
              ? prevState
              : [...prevState, receive.userId]
          );
        }
      }
    };
  }, [completeOrders]);
  return (
    <>
      <Container centerContent>
        <Heading fontSize={'4xl'}>お呼び出し中の番号</Heading>
        {completeOrders.map((n, i) => {
          return (
            <Text fontSize={'3xl'} key={i}>
              {n}
            </Text>
          );
        })}
      </Container>
    </>
  );
};

export default Notify;
