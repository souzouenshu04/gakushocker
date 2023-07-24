import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useMutation, useQuery } from 'urql';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateOrderDocument,
  GetUserInfoDocument,
  Order,
} from '../../generated/graphql';
import { OrderTable } from '@/components/OrderTable';
import { cartIDState, orderInputState, totalState } from '@/recoil/cart';
import { tokenState } from '@/recoil/signin';
import { userIDState, userState } from '@/recoil/user';

const Payment = () => {
  let [user, setUser] = useRecoilState(userState);
  let router = useRouter();
  let [_createOrderResult, createOrder] = useMutation(CreateOrderDocument);
  let [getUserInfoQueryResult, reExecuteGetUserInfoQuery] = useQuery({
    query: GetUserInfoDocument,
    variables: {
      email: user.email,
    },
  });
  let { data, fetching, error } = getUserInfoQueryResult;
  let orderItems = useRecoilValue(orderInputState);
  let [total, setTotal] = useRecoilState(totalState);
  let userID = useRecoilValue(userIDState);
  let [_createOrderResultState, setCreateOrderResultState] = useState<
    Order | undefined
  >(undefined);
  let setCartIndex = useSetRecoilState(cartIDState);
  let token = useRecoilValue(tokenState);
  const [paymentMethod, setPaymentMethod] = useState('point');

  const submit = () => {
    const variables = {
      input: {
        id: uuidv4(),
        items: orderItems,
        total: total,
        userId: userID,
        isUsePoint: paymentMethod === 'point',
      },
    };
    createOrder(variables, {
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
      .then((result) => {
        if (paymentMethod !== 'point') {
          axios
            .post('/api/paypay', {
              amount: total,
            })
            .then((res) => {
              location.replace(res.data.body.data.url);
            });
        }
        if (result.error) {
          console.dir(result.error);
        }
        setCreateOrderResultState(result.data);
        reExecuteGetUserInfoQuery({
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        console.dir(result.data);
      })
      .then(() => {
        if (error) {
          console.dir(error.message);
        }
        if (fetching) {
          console.log('fetching');
        }
        setUser(data.findUserByEmail);
        console.dir(data.findUserByEmail);
        setTotal(0);
        setCartIndex([]);
      })
      .then(() => {
        router.push('/thanks');
      });
  };
  return (
    <>
      <Container centerContent>
        <Heading textAlign={'center'}>お支払い</Heading>
        <OrderTable />
        <FormControl>
          <FormLabel>お支払い方法を選択</FormLabel>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
            <HStack>
              <Radio value={'point'}>
                保有ポイントで支払う 残高 {user.point} pt
              </Radio>
              <Radio value={'paypay'}>PayPayで支払う</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <Button
          type={'submit'}
          onClick={() => submit()}
          colorScheme={'teal'}
          variant={'ghost'}
        >
          支払いを完了する
        </Button>
      </Container>
    </>
  );
};

export default Payment;
