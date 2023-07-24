import { Input, Td, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { Product } from '../../../generated/graphql';

export const ProductInfo = (props: Product) => {
  const [price, setPrice] = useState(props.price);
  const [stock, setStock] = useState(props.stock);
  return (
    <>
      <Tr>
        <Td>{props.id}</Td>
        <Td>{props.name}</Td>
        <Td>
          <Input
            variant={'flushed'}
            placeholder={`${price}`}
            onChange={(event) => setPrice(+event.target.value)}
          ></Input>
        </Td>
        <Td>
          <Input
            variant={'flushed'}
            placeholder={`${stock}`}
            onChange={(event) => setStock(+event.target.value)}
          ></Input>
        </Td>
      </Tr>
    </>
  );
};
