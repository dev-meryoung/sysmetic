import { RouterProvider } from 'react-router-dom';
import Modal from '@/components/Modal';
import router from '@/routes/Router';
import { useModalStore } from '@/stores/useModalStore';
import GlobalStyles from '@/styles/GlobalStyles';

const App = () => {
  const { modals } = useModalStore();

  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
      {Object.keys(modals).map((id) => (
        <Modal key={id} id={id} />
      ))}
    </>
  );
};

export default App;
