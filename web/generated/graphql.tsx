import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  NaiveDateTime: any;
  UUID: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder: Order;
  createProduct: Product;
  createUser: User;
  deleteOrder: Order;
  deleteProduct: Product;
  deleteUser: User;
};


export type MutationCreateOrderArgs = {
  input: OrderInput;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationDeleteOrderArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['NaiveDateTime'];
  id: Scalars['UUID'];
  items: Array<OrderItem>;
  total: Scalars['Int'];
  userId: Scalars['Int'];
};

export type OrderInput = {
  id: Scalars['UUID'];
  isUsePoint: Scalars['Boolean'];
  items: Array<OrderItemInput>;
  total: Scalars['Int'];
  userId: Scalars['Int'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  name: Scalars['String'];
  price: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type OrderItemInput = {
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Int'];
  stock: Scalars['Int'];
};

export type ProductInput = {
  name: Scalars['String'];
  price: Scalars['Int'];
  stock: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  findOrderById?: Maybe<Order>;
  findProductById?: Maybe<Product>;
  findRecentOrderByUserId: Order;
  findUserByEmail?: Maybe<User>;
  findUserById?: Maybe<User>;
  listOrder: Array<Order>;
  listOrderBySpecifiedUser: Array<Order>;
  listProduct: Array<Product>;
  listUser: Array<User>;
};


export type QueryFindOrderByIdArgs = {
  id: Scalars['UUID'];
};


export type QueryFindProductByIdArgs = {
  id: Scalars['Int'];
};


export type QueryFindRecentOrderByUserIdArgs = {
  userId: Scalars['Int'];
};


export type QueryFindUserByEmailArgs = {
  email: Scalars['String'];
};


export type QueryFindUserByIdArgs = {
  id: Scalars['Int'];
};


export type QueryListOrderBySpecifiedUserArgs = {
  userId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  isAdmin: Scalars['Boolean'];
  password: Scalars['String'];
  point: Scalars['Int'];
};

export type UserInput = {
  displayName: Scalars['String'];
  email: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  password: Scalars['String'];
  point: Scalars['Int'];
};

export type CreateOrderMutationVariables = Exact<{
  input: OrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', id: any, userId: number, total: number, createdAt: any, items: Array<{ __typename?: 'OrderItem', name: string, price: number, quantity: number }> } };

export type GetUserInfoQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', findUserByEmail?: { __typename?: 'User', id: number, displayName: string, email: string, password: string, point: number, isAdmin: boolean } | null };

export type ListOrderSpecifiedUserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type ListOrderSpecifiedUserQuery = { __typename?: 'Query', findRecentOrderByUserId: { __typename?: 'Order', id: any, userId: number, total: number, createdAt: any, items: Array<{ __typename?: 'OrderItem', name: string, price: number, quantity: number }> } };

export type ListProductQueryVariables = Exact<{ [key: string]: never; }>;


export type ListProductQuery = { __typename?: 'Query', listProduct: Array<{ __typename?: 'Product', id: number, name: string, price: number, stock: number }> };


export const CreateOrderDocument = gql`
    mutation createOrder($input: OrderInput!) {
  createOrder(input: $input) {
    id
    userId
    items {
      name
      price
      quantity
    }
    total
    createdAt
  }
}
    `;

export function useCreateOrderMutation() {
  return Urql.useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument);
};
export const GetUserInfoDocument = gql`
    query getUserInfo($email: String!) {
  findUserByEmail(email: $email) {
    id
    displayName
    email
    password
    point
    isAdmin
  }
}
    `;

export function useGetUserInfoQuery(options: Omit<Urql.UseQueryArgs<GetUserInfoQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>({ query: GetUserInfoDocument, ...options });
}
export const ListOrderSpecifiedUserDocument = gql`
    query listOrderSpecifiedUser($userId: Int!) {
  findRecentOrderByUserId(userId: $userId) {
    id
    userId
    items {
      name
      price
      quantity
    }
    total
    createdAt
  }
}
    `;

export function useListOrderSpecifiedUserQuery(options: Omit<Urql.UseQueryArgs<ListOrderSpecifiedUserQueryVariables>, 'query'>) {
  return Urql.useQuery<ListOrderSpecifiedUserQuery, ListOrderSpecifiedUserQueryVariables>({ query: ListOrderSpecifiedUserDocument, ...options });
}
export const ListProductDocument = gql`
    query listProduct {
  listProduct {
    id
    name
    price
    stock
  }
}
    `;

export function useListProductQuery(options?: Omit<Urql.UseQueryArgs<ListProductQueryVariables>, 'query'>) {
  return Urql.useQuery<ListProductQuery, ListProductQueryVariables>({ query: ListProductDocument, ...options });
}