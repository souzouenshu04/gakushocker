import { User } from '../../generated/graphql';

export interface ReservedUser {
  id: number;
  display_name: string;
  email: string;
  password: string;
  point: number;
  token: string;
}

export const toCamel = (reservedUser: ReservedUser): User => {
   return {
    displayName: reservedUser.display_name,
     isAdmin: false,
     ...reservedUser
   };
};
