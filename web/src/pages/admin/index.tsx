import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CircularProgress,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'urql';
import { ListProductDocument } from '../../../generated/graphql';
import { ProductInfoList } from '@/components/admin/ProductInfoList';
import { isSigninState, tokenState } from '@/recoil/signin';

const Home = () => {
  const isSignin = useRecoilValue(isSigninState);
  const router = useRouter();

  useEffect(() => {
    if (!isSignin) {
      router.push('/');
    }
  }, [isSignin, router]);

  const token = useRecoilValue(tokenState);
  let [menuQueryResult, _reExecuteMenuQuery] = useQuery({
    query: ListProductDocument,
    context: useMemo(
      () => ({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }),
      [token]
    ),
  });
  const { data, fetching, error } = menuQueryResult;
  return (
    <>
      {fetching && (
        <CircularProgress isIndeterminate color="green.400"></CircularProgress>
      )}
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {data && (
        <>
          <Button
            variant={'ghost'}
            colorScheme={'teal'}
            onClick={() => router.push('/customer')}
          >
            ユーザーID入力画面へ
          </Button>
          <Button
            variant={'ghost'}
            colorScheme={'teal'}
            onClick={() => router.push('/admin/orders')}
          >
            オーダー確認画面へ
          </Button>
          <Button
            variant={'ghost'}
            colorScheme={'teal'}
            onClick={() => router.push('/admin/notify')}
          >
            お知らせ画面へ
          </Button>
          <ProductInfoList list={data.listProduct} />
        </>
      )}
    </>
  );
};

export default Home;
