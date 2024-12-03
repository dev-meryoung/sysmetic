import { useQuery } from '@tanstack/react-query';
import { getMainPage, getMainPageChart } from '@/api/commonApi';

interface MainPageDataProps {
  data: {
    rankedTrader: {
      id: number;
      nickname: string;
      followerCount: number;
      accumProfitLossRate: number;
    }[];

    totalTraderCount: number;
    totalStrategyCount: number;

    smScoreTopFives: {
      id: number;
      traderId: number;
      nickname: string;
      name: string;
      stocks: {
        stockIds: number[];
        stockNames: string[];
      }[];
      smScore: number;
    }[];
  };
}

// 메인페이지 조회
export const useGetMainPage = () =>
  useQuery<MainPageDataProps>({
    queryKey: ['mainPage'],
    queryFn: () => getMainPage(),
  });

export const useGetMainPageChart = () => {};
