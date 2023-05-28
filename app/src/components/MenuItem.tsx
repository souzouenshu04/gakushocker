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
  ButtonGroup,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Product } from '../../generated/graphql';
import { supabase } from '@/libs/supabase';
import { cartIDState, totalState, cartItemState } from '@/recoil/cart';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { MinusIcon } from '@/components/icons/MinusIcon';
import ProductInfo from '@/components/ProductInfo';

interface ItemState {
  stock: number;
  count: number;
}

export const MenuItem = (props: Product) => {
  const { data } = supabase.storage
    .from('thumbnail')
    .getPublicUrl(`${props.id}.webp`);

  let [itemState, setItemState] = useState<ItemState>({
    stock: props.stock,
    count: 0,
  });

  let [total, setTotal] = useRecoilState(totalState);
  let [cartIndex, setCartIndex] = useRecoilState(cartIDState);
  let setCartItem = useSetRecoilState(cartItemState(props.id));

  useEffect(() => {
    setCartItem({
      productId: props.id,
      quantity: itemState.count,
      name: props.name,
      price: props.price,
    });
  }, [itemState]);

  const addToCart = () => {
    if (itemState.count >= props.stock) {
      return;
    }
    const updatedCount = itemState.count + 1;
    const updatedStock = itemState.stock - 1;
    if (itemState.count === 0) {
      setCartIndex([...cartIndex, props.id]);
    }
    setItemState((prevItemState) => ({
        ...prevItemState,
        count: updatedCount,
        stock: updatedStock,
    }));
    setTotal((prevTotal) => prevTotal + props.price);
  };

  const removeFromCart = () => {
    if (itemState.count <= 0) {
      return;
    }
    const updatedCount = itemState.count - 1;
    const updatedStock = itemState.stock + 1;
    if (itemState.count === 1) {
      setCartIndex((currVal) => {
        return currVal.filter((id) => id !== props.id);
      });
    }
    setItemState((prevItemState) => ({
        ...prevItemState,
        count: updatedCount,
        stock: updatedStock,
    }));
    setTotal((prevTotal) => prevTotal - props.price);
  };

  return (
    <Card maxW="sm" border="1px" borderColor="gray.300">
      <ProductInfo
        data = {data}
        name = {props.name}
        price = {props.price}
        itemState = {itemState}
      />
      <Divider />
      <CardFooter>
        <Flex>
          {props.stock > 0 ? (
            itemState.count === 0 ? (
              <Button variant="ghost" colorScheme="blue" onClick={() => addToCart()}>
                カートに入れる
              </Button>
            ) : (
              <Box>
                <ButtonGroup gap="2" mx="2">
                  <Button onClick={() => addToCart()}>
                    <PlusIcon />
                  </Button>

                  <Text fontSize="2xl">{itemState.count}</Text>

                  <Button onClick={() => removeFromCart()}>
                    <MinusIcon />
                  </Button>
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
