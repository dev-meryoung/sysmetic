import { RouterProvider } from 'react-router-dom';
import router from '@/routes/Router';
import GlobalStyles from '@/styles/GlobalStyles';

const App = () => (
  <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>
);

export default App;
