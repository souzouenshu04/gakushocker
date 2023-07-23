import { User } from '../../generated/graphql';

export interface ReservedUser {
  id: number;
  displayName: string;
  email: string;
  password: string;
  point: number;
  token: string;
  isAdmin: boolean
}