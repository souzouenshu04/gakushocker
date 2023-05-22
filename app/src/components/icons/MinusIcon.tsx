import { IconButton } from '@chakra-ui/react';
import { MinusIcon as Icon } from '@chakra-ui/icons';

export const MinusIcon = () => {
  return (
    <IconButton icon={<Icon />} color={'blue.400'} aria-label={'add cart'}>
      minus icon
    </IconButton>
  );
};
