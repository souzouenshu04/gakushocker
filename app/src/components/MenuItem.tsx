import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  Image,
  Button,
  Flex,
  IconButton,
  ButtonGroup,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Product } from '../../generated/graphql';
import { supabase } from '@/libs/supabase';
import { cartIDState, totalState, cartItemState } from '@/recoil/cart';

interface ItemState {
  isSelected: boolean;
  stock: number;
  count: number;
}

export const MenuItem = (props: Product) => {
  const { data } = supabase.storage
    .from('thumbnail')
    .getPublicUrl(`${props.id}.webp`);

  let [itemState, setItemState] = useState<ItemState>({
    isSelected: false,
    stock: props.stock,
    count: 0,
  });

  let [total, setTotal] = useRecoilState(totalState);
  let [cartIndex, setCartIndex] = useRecoilState(cartIDState);
  let [isSelected, setIsSelected] = useState(false);
  let setCartItem = useSetRecoilState(cartItemState(props.id));

  useEffect(() => {
    setCartItem({
      productId: props.id,
      quantity: itemState.count,
      name: props.name,
      price: props.price,
    });
  }, [itemState]);

  const plus = () => {
    if (itemState.count < props.stock) {
      if (itemState.count === 0) {
        setIsSelected(true);
        setCartIndex([...cartIndex, props.id]);
      }
      setItemState((prevState) => {
        return {
          ...prevState,
          count: prevState.count + 1,
          stock: prevState.stock - 1,
        };
      });
      setTotal((prevValue) => prevValue + props.price);
    }
  };

  const minus = () => {
    if (itemState.count > 0) {
      if (itemState.count === 1) {
        setIsSelected(false);
        setCartIndex((currVal) => {
          return currVal.filter((i) => i !== props.id);
        });
      }
      setItemState((prevState) => {
        return {
          ...prevState,
          count: prevState.count - 1,
          stock: prevState.stock + 1,
        };
      });
      setTotal(total - props.price);
    }
  };

  return (
    <Card maxW="sm" border="1px" borderColor="gray.300">
      <CardBody>
        <Image src={data.publicUrl} alt="商品の写真" borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{props.name}</Heading>
          <Text color="blue.600" fontSize="2xl">
            ￥{props.price}
          </Text>
          <Text color="blue.600" fontSize="2xl">
            残り {itemState.stock}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Flex>
          {props.stock > 0 ? (
            !isSelected ? (
              <Button variant="ghost" colorScheme="blue" onClick={() => plus()}>
                カートに入れる
              </Button>
            ) : (
              <Box>
                <ButtonGroup gap={'2'} mx={'2'}>
                  <IconButton
                    icon={<AddIcon />}
                    color={'blue.400'}
                    aria-label={'add cart'}
                    onClick={() => plus()}
                  >
                    plus icon
                  </IconButton>
                  <Text fontSize={'2xl'}>{itemState.count}</Text>
                  <IconButton
                    icon={<MinusIcon />}
                    color={'blue.400'}
                    aria-label={'delete cart'}
                    onClick={() => minus()}
                  >
                    minus icon
                  </IconButton>
                </ButtonGroup>
              </Box>
            )
          ) : (
            <Button variant="ghost" colorScheme="red" isDisabled>
              売り切れ
            </Button>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
};
