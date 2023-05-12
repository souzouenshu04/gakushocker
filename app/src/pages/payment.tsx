import { Button, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation, useQuery } from 'urql';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateOrderDocument,
  GetUserInfoDocument,
  Order,
  User,
} from '../../generated/graphql';
import { cartIDState, orderInputState, totalState } from '@/recoil/cart';
import { userIDState, userState } from '@/recoil/user';

const Payment = () => {
  let [user, setUser] = useRecoilState(userState);
  let router = useRouter();
  let [createOrderResult, createOrder] = useMutation(CreateOrderDocument);
  let [getUserInfoQueryResult, reExecuteGetUserInfoQuery] = useQuery({
    query: GetUserInfoDocument,
    variables: {
      email: 'demo',
    },
  });
  let { data, fetching, error } = getUserInfoQueryResult;
  let orderItems = useRecoilValue(orderInputState);
  let [total, setTotal] = useRecoilState(totalState);
  let userID = useRecoilValue(userIDState);
  let [createOrderResultState, setCreateOrderResultState] = useState<
    Order | undefined
  >(undefined);
  let [getUserInfoResultState, setGetUserInfoResultState] = useState<
    User | undefined
  >(undefined);
  let [cartIndex, setCartIndex] = useRecoilState(cartIDState);

  const cleanCart = () => {
    setCartIndex([]);
  };

  const submit = () => {
    const variables = {
      input: {
        id: uuidv4(),
        items: orderItems,
        status: 'UNPAID',
        total: total,
        userId: userID,
      },
    };
    createOrder(variables)
      .then((result) => {
        if (result.error) {
          console.dir(result.error);
        }
        setCreateOrderResultState(result.data);
        reExecuteGetUserInfoQuery({});
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
        // setUser((currVal) => {
        //   return {
        //     ...currVal,
        //     point: result.data.getUserById.point,
        //   };
        // });
      })
      .then(() => {
        router.push('/');
      });
  };
  return (
    <>
      <Heading textAlign={'center'}>お支払い情報</Heading>
      <RadioGroup>
        <Stack>
          <Radio>保有ポイントで支払う 残高 {user.point} pt</Radio>
          <Radio>PayPayで支払う</Radio>
        </Stack>
      </RadioGroup>
      <Button onClick={() => submit()}>支払いを完了する</Button>
    </>
  );
};

export default Payment;
