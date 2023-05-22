import { atom, selector } from "recoil";
import { User } from '../../generated/graphql';

export const userState = atom<User>({
  key: 'userState',
  default: {
    id: 0,
    displayName: '',
    email: '',
    password: '',
    point: 0,
  },
});

export const userIDState = selector<number>({
  key: 'userIDState',
  get: ({get}) => {
   let user =  get(userState);
   return user.id
  }
})