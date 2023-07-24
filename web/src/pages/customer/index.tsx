import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Message } from '@/models/Message';

const Index = () => {
  const ws = useRef<WebSocket>(undefined as any);
  const input = useRef<HTMLInputElement>(undefined as any);
  const [userId, setUserId] = useState('');
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
  }, []);
  const onClick = () => {
    let inputValue = +userId;
    let getOrderRequest: Message = {
      type: 'GetOrderInfo',
      userId: inputValue,
    };
    ws.current.send(JSON.stringify(getOrderRequest));
    setUserId('');
    input.current.value = '';
  };
  return (
    <>
      <Container centerContent>
        <FormControl>
          <FormLabel>ユーザーID</FormLabel>{' '}
          <Input
            ref={input}
            type={'number'}
            placeholder={'自分のユーザーidを入力'}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button
            colorScheme={'teal'}
            variant={'ghost'}
            onClick={() => onClick()}
          >
            送信
          </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default Index;
