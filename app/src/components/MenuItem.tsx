import {
  Card,
  Text,
  Divider,
  CardFooter,
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
import ProductInfo from '@/components/ProductInfo';
import { IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
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

  const addToCart = () => {
    if (itemState.count >= props.stock) {
      return;
    }
    const updatedCount = itemState.count + 1;
    const updatedStock = itemState.stock - 1;
    if (itemState.count === 0) {
      setIsSelected(true);
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
      setIsSelected(false);
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
        publicUrl = {data.publicUrl}
        name = {props.name}
        price = {props.price}
        stock = {itemState.stock}
      />
      <Divider />
      <CardFooter>
        <Flex>
          {props.stock > 0 ? (
            !isSelected ? (
              <Button variant="ghost" colorScheme="blue" onClick={() => addToCart()}>
                カートに入れる
              </Button>
            ) : (
              <Box>
                <ButtonGroup gap="2" mx="2">
                  <IconButton onClick={() => addToCart()} icon={<AddIcon />} color={'blue.400'} aria-label={'add cart'}>
                    plus icon
                  </IconButton>

                  <Text fontSize="2xl">{itemState.count}</Text>

                    <IconButton onClick={() => removeFromCart()} icon={<MinusIcon />} color={'blue.400'} aria-label={'add cart'}>
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
