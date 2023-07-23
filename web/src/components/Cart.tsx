import {
  Button,
  Icon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiCart } from 'react-icons/bi';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/recoil/cart';

export const Cart = () => {
  const cart = useRecoilValue(cartState);
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
            <UnorderedList>
              {cart.map((i, index) => {
                return (
                  <ListItem key={index}>
                    {i.name} × {i.quantity}
                    <NumberInput defaultValue={i.quantity}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </ListItem>
                );
              })}
            </UnorderedList>
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
