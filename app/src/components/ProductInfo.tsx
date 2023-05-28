import {
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
} from '@chakra-ui/react';

interface ProductInfoProps {
  data: {
    publicUrl: string;
  };
  name: string;
  price: number;
  itemState: {
    stock: number;
  };
}

const ProductInfo = (props: ProductInfoProps) => {
  const { data, name, price, itemState } = props;

  return (
    <CardBody>
      <Image src={data.publicUrl} alt="商品の写真" borderRadius="lg" />
      <Stack mt="6" spacing="3">
        <Heading size="md">{name}</Heading>
        <Text color="blue.600" fontSize="2xl">
          ￥{price}
        </Text>
        <Text color="blue.600" fontSize="2xl">
          残り {itemState.stock}
        </Text>
      </Stack>
    </CardBody>
  );
};

export default ProductInfo;
