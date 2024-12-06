import { createBrowserRouter } from 'react-router-dom';
import RequireAdmin from '@/components/auth/RequireAdmin';
import RequireAuth from '@/components/auth/RequireAuth';
import { PATH } from '@/constants/path';
import AdminStrategyLayout from '@/layouts/AdminStrategyLayout';
import Layout from '@/layouts/Layout';
import MyPageLayout from '@/layouts/MyPageLayout';
import SignupStepLayout from '@/layouts/SignupStepLayout';
import StrategyDetailLayout from '@/layouts/StrategyDetailLayout';
import StrategyListLayout from '@/layouts/StrategyListLayout';
import Admin from '@/pages/admin/Admin';
import AdminMethods from '@/pages/admin/AdminMethods';
import AdminNoticeAdd from '@/pages/admin/AdminNoticeAdd';
import AdminNoticeEdit from '@/pages/admin/AdminNoticeEdit';
import AdminNotices from '@/pages/admin/AdminNotices';
import AdminNoticesDetail from '@/pages/admin/AdminNoticesDetail';
import AdminQna from '@/pages/admin/AdminQna';
import AdminQnaDetail from '@/pages/admin/AdminQnaDetail';
import AdminStocks from '@/pages/admin/AdminStocks';
import AdminStrategies from '@/pages/admin/AdminStrategies';
import AdminStrategiesControl from '@/pages/admin/AdminStrategiesControl';
import AdminUsers from '@/pages/admin/AdminUsers';
import Faq from '@/pages/Faq';
import Home from '@/pages/Home';
import MyPage from '@/pages/mypage/MyPage';
import MyPageOpt from '@/pages/mypage/MyPageOpt';
import MyPagePassword from '@/pages/mypage/MyPagePassword';
import MyQnaEdit from '@/pages/mypage/MyQnaEdit';
import MyStrategyEdit from '@/pages/mypage/MyStrategyEdit';
import Profile from '@/pages/mypage/Profile';
import ProfileEdit from '@/pages/mypage/ProfileEdit';
import QnaAnswer from '@/pages/mypage/QnaAnswer';
import QnaDetail from '@/pages/mypage/QnaDetail';
import QnaList from '@/pages/mypage/QnaList';
import Withdraw from '@/pages/mypage/Withdraw';
import NotFound from '@/pages/NotFound';
import Notices from '@/pages/Notices';
import NoticesDetail from '@/pages/NoticesDetail';
import Policy from '@/pages/Policy';
import QnaQuestion from '@/pages/QnaQuestion';
import SignFindId from '@/pages/SignFindId';
import SignFindPw from '@/pages/SignFindPw';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import SignUpDone from '@/pages/SignUpDone';
import SignUpForm from '@/pages/SignUpForm';
import SignUpType from '@/pages/SignUpType';
import StrategyAdd from '@/pages/StrategyAdd';
import StrategyDetail from '@/pages/StrategyDetail';
import StrategyDetailAccount from '@/pages/StrategyDetailAccount';
import StrategyDetailDaily from '@/pages/StrategyDetailDaily';
import StrategyDetailMonthly from '@/pages/StrategyDetailMonthly';
import StrategyList from '@/pages/StrategyList';
import TraderList from '@/pages/TraderList';
import TraderStrategyList from '@/pages/TraderStrategyList';

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Home />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: PATH.SIGN_IN,
        element: <SignIn />,
      },
      {
        path: PATH.SIGN_FIND_PW,
        element: <SignFindPw />,
      },
      {
        path: PATH.SIGN_FIND_ID,
        element: <SignFindId />,
      },
      {
        path: PATH.SIGN_UP,
        element: <SignUp />,
      },
      {
        path: PATH.SIGN_UP_TYPE(),
        element: <SignupStepLayout />,
        children: [
          {
            index: true,
            element: <SignUpType />,
          },
          {
            path: PATH.SIGN_UP_FORM(),
            element: <SignUpForm />,
          },
          {
            path: PATH.SIGN_UP_DONE(),
            element: <SignUpDone />,
          },
        ],
      },
      {
        path: PATH.STRATEGIES_LIST,
        element: <StrategyListLayout />,
        children: [
          {
            index: true,
            element: <StrategyList />,
          },
          {
            path: PATH.TRADERS,
            element: <TraderList />,
          },
        ],
      },
      {
        path: PATH.STRATEGIES_DETAIL(),
        element: <StrategyDetailLayout />,
        children: [
          {
            index: true,
            element: <StrategyDetail />,
          },
          {
            path: PATH.STRATEGIES_DETAIL_DAILY(),
            element: <StrategyDetailDaily />,
          },
          {
            path: PATH.STRATEGIES_DETAIL_MONTHLY(),
            element: <StrategyDetailMonthly />,
          },
          {
            path: PATH.STRATEGIES_DETAIL_ACCOUNT(),
            element: <StrategyDetailAccount />,
          },
        ],
      },
      {
        path: PATH.TRADER_STRATEGIES(),
        element: <TraderStrategyList />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: PATH.STRATEGIES_QNA(),
            element: <QnaQuestion />,
          },
          {
            path: PATH.STRATEGIES_ADD,
            element: <StrategyAdd />,
          },
          {
            path: PATH.MYPAGE,
            element: <MyPageLayout />,
            children: [
              {
                index: true,
                element: <MyPage />,
              },
              {
                path: PATH.MYPAGE_PROFILE(),
                element: <Profile />,
              },
              {
                path: PATH.MYPAGE_QNA(),
                children: [
                  {
                    index: true,
                    element: <QnaList />,
                  },
                  {
                    path: PATH.MYPAGE_QNA_DETAIL(),
                    element: <QnaDetail />,
                  },
                ],
              },
            ],
          },
          {
            path: PATH.MYPAGE_QNA_ANSWER(),
            element: <QnaAnswer />,
          },
          {
            path: PATH.MYPAGE_PROFILE_EDIT(),
            element: <ProfileEdit />,
          },
          {
            path: PATH.MYPAGE_PASSWORD(),
            element: <MyPagePassword />,
          },
          {
            path: PATH.MYPAGE_OPT(),
            element: <MyPageOpt />,
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
            path: PATH.MYPAGE_STRATEGIES_EDIT(),
            element: <MyStrategyEdit />,
          },
        ],
      },
      {
        element: <RequireAdmin />,
        children: [
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
            path: PATH.ADMIN_NOTICES_DETAIL(),
            element: <AdminNoticesDetail />,
          },
          {
            path: PATH.ADMIN_STRATEGIES_CONTROL(),
            element: <AdminStrategiesControl />,
          },
          {
            path: PATH.ADMIN_STRATEGIES,
            element: <AdminStrategyLayout />,
            children: [
              {
                index: true,
                element: <AdminStrategies />,
              },
              {
                path: PATH.ADMIN_METHODS,
                element: <AdminMethods />,
              },
              {
                path: PATH.ADMIN_STOCKS,
                element: <AdminStocks />,
              },
            ],
          },
          {
            path: PATH.ADMIN_QNA,
            element: <AdminQna />,
          },
          {
            path: PATH.ADMIN_QNA_DETAIL(),
            element: <AdminQnaDetail />,
          },
        ],
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
      {
        path: PATH.POLICY,
        element: <Policy />,
      },
      {
        path: PATH.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
