import { CardBody, Image, Stack, Heading, Text } from '@chakra-ui/react';

interface ProductInfoProps {
  publicUrl: string;
  name: string;
  price: number;
  stock: number;
}

const ProductInfo = (props: ProductInfoProps) => {
  const { publicUrl, name, price, stock } = props;

  return (
    <CardBody>
      <Image src={publicUrl} alt="商品の写真" borderRadius="lg" />
      <Stack mt="6" spacing="3">
        <Heading size="md">{name}</Heading>
        <Text color="blue.600" fontSize="2xl">
          ￥{price}
        </Text>
        <Text color="blue.600" fontSize="2xl">
          残り {stock}
        </Text>
      </Stack>
    </CardBody>
  );
};

export default ProductInfo;
