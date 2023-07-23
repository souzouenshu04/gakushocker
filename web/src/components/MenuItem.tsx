import { Card, Divider, CardFooter, Button, Flex } from '@chakra-ui/react';
import { setCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Product } from '../../generated/graphql';
import ProductInfo from '@/components/ProductInfo';
import { supabase } from '@/libs/supabase';
import {
  cartIDState,
  totalState,
  cartItemState,
  cartState,
} from '@/recoil/cart';
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

  const setTotal = useSetRecoilState(totalState);
  const [cartIndex, setCartIndex] = useRecoilState(cartIDState);
  const setCartItem = useSetRecoilState(cartItemState(props.id));
  const nowCartState = useRecoilValue(cartState);

  useEffect(() => {
    setCartItem({
      productId: props.id,
      quantity: itemState.count,
      name: props.name,
      price: props.price,
    });
  }, [itemState, props.id, props.name, props.price, setCartItem]);

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
    setCookie(null, 'cart', JSON.stringify(nowCartState), {
      path: '/',
    });
  };

  return (
    <Card maxW="sm" border="1px" borderColor="gray.300">
      <ProductInfo
        publicUrl={data.publicUrl}
        name={props.name}
        price={props.price}
        stock={itemState.stock}
      />
      <Divider />
      <CardFooter>
        <Flex>
          {props.stock > 0 ? (
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => addToCart()}
            >
              カートに入れる
            </Button>
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
