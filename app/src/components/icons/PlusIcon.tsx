import { IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export const PlusIcon = () => {
  return (
    <IconButton icon={<AddIcon />} color={'blue.400'} aria-label={'add cart'}>
      plus icon
    </IconButton>
  );
};
