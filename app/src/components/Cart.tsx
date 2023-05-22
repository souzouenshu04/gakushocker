import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiCart } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/recoil/cart';

export const Cart = () => {
  let cart = useRecoilValue(cartState);
  let router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Icon as={BiCart} onClick={onOpen} w={8} h={8}>
        カートを開く
      </Icon>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>カート</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {cart.map((i, index) => {
              return (
                <Text key={index}>
                  {i.name}
                  {i.quantity}
                </Text>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={'blue'} mr={3} onClick={onClose}>
              閉じる
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => {
                onClose();
                router.push('/confirm');
              }}
            >
              購入へ進む
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
