import { createBrowserRouter } from 'react-router-dom';
import { PATH } from '@/constants/path';
import Layout from '@/layouts/Layout';
import Admin from '@/pages/admin/Admin';
import AdminMethods from '@/pages/admin/AdminMethods';
import AdminNoticeAdd from '@/pages/admin/AdminNoticeAdd';
import AdminNoticeEdit from '@/pages/admin/AdminNoticeEdit';
import AdminNotices from '@/pages/admin/AdminNotices';
import AdminQna from '@/pages/admin/AdminQna';
import AdminStocks from '@/pages/admin/AdminStocks';
import AdminStrategies from '@/pages/admin/AdminStrategies';
import AdminUsers from '@/pages/admin/AdminUsers';
import Faq from '@/pages/Faq';
import Home from '@/pages/Home';
import MyInterestList from '@/pages/mypage/MyInterestList';
import MyPage from '@/pages/mypage/MyPage';
import MyPageCheck from '@/pages/mypage/MyPageCheck';
import MyQnaEdit from '@/pages/mypage/MyQnaEdit';
import MyStrategyEdit from '@/pages/mypage/MyStrategyEdit';
import MyStrategyList from '@/pages/mypage/MyStrategyList';
import Profile from '@/pages/mypage/Profile';
import ProfileEdit from '@/pages/mypage/ProfileEdit';
import TraderQnaList from '@/pages/mypage/TraderQnaList';
import UserQnaList from '@/pages/mypage/UserQnaList';
import Withdraw from '@/pages/mypage/Withdraw';
import NotFound from '@/pages/NotFound';
import Notices from '@/pages/Notices';
import NoticesDetail from '@/pages/NoticesDetail';
import QnaAdd from '@/pages/QnaAdd';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import StrategyAdd from '@/pages/StrategyAdd';
import StrategyDetail from '@/pages/StrategyDetail';
import StrategyList from '@/pages/StrategyList';
import StrategySearch from '@/pages/StrategySearch';
import Temp from '@/pages/Temp';
import TraderList from '@/pages/TraderList';
import TraderStrategyInfo from '@/pages/TraderStrategyInfo';
import TraderStrategyList from '@/pages/TraderStrategyList';
import UserStrategyInfo from '@/pages/UserStrategyInfo';

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Layout />,
    children: [
      {
        path: PATH.SIGN_IN,
        element: <SignIn />,
      },
      {
        path: PATH.SIGN_UP,
        element: <SignUp />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        path: PATH.STRATEGIES_INFO_USER,
        element: <UserStrategyInfo />,
      },
      {
        path: PATH.STRATEGIES_LIST,
        element: <StrategyList />,
      },
      {
        path: PATH.STRATEGIES_DETAIL(),
        element: <StrategyDetail />,
      },
      {
        path: PATH.ADD_QNA(),
        element: <QnaAdd />,
      },
      {
        path: PATH.TRADERS,
        element: <TraderList />,
      },
      {
        path: PATH.TRADER_STRATEGIES(),
        element: <TraderStrategyList />,
      },
      {
        path: PATH.STRATEGIES_SEARCH,
        element: <StrategySearch />,
      },
      {
        path: PATH.STRATEGIES_INFO_TRADER,
        element: <TraderStrategyInfo />,
      },
      {
        path: PATH.STRATEGIES_ADD,
        element: <StrategyAdd />,
      },
      {
        path: PATH.MYPAGE,
        element: <MyPage />,
      },
      {
        path: PATH.MYPAGE_CHECK,
        element: <MyPageCheck />,
      },
      {
        path: PATH.MYPAGE_PROFILE,
        element: <Profile />,
      },
      {
        path: PATH.MYPAGE_PROFILE_EDIT,
        element: <ProfileEdit />,
      },
      {
        path: PATH.MYPAGE_QNA_USER,
        element: <UserQnaList />,
      },
      {
        path: PATH.MYPAGE_QNA_TRADER,
        element: <TraderQnaList />,
      },
      {
        path: PATH.MYPAGE_QNA_EDIT(),
        element: <MyQnaEdit />,
      },
      {
        path: PATH.MYPAGE_WITHDRAW,
        element: <Withdraw />,
      },
      {
        path: PATH.MYPAGE_INTERESTS,
        element: <MyInterestList />,
      },
      {
        path: PATH.MYPAGE_STRATEGIES,
        element: <MyStrategyList />,
      },
      {
        path: PATH.MYPAGE_STRATEGIES_EDIT(),
        element: <MyStrategyEdit />,
      },
      {
        path: PATH.ADMIN,
        element: <Admin />,
      },
      {
        path: PATH.ADMIN_USERS,
        element: <AdminUsers />,
      },
      {
        path: PATH.ADMIN_NOTICES,
        element: <AdminNotices />,
      },
      {
        path: PATH.ADMIN_NOTICES_ADD,
        element: <AdminNoticeAdd />,
      },
      {
        path: PATH.ADMIN_NOTICES_EDIT(),
        element: <AdminNoticeEdit />,
      },
      {
        path: PATH.ADMIN_STOCKS,
        element: <AdminStocks />,
      },
      {
        path: PATH.ADMIN_METHODS,
        element: <AdminMethods />,
      },
      {
        path: PATH.ADMIN_STRATEGIES,
        element: <AdminStrategies />,
      },
      {
        path: PATH.ADMIN_QNA,
        element: <AdminQna />,
      },
      {
        path: PATH.NOTICES,
        element: <Notices />,
      },
      {
        path: PATH.NOTICES_DETAIL(),
        element: <NoticesDetail />,
      },
      {
        path: PATH.FAQ,
        element: <Faq />,
      },
    ],
  },
  {
    path: PATH.TEMP,
    element: <Temp />,
  },
  {
    path: PATH.NOT_FOUND,
    element: <NotFound />,
  },
]);

export default router;
