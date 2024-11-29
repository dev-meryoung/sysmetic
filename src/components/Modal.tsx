import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@/components/IconButton';
import { COLOR } from '@/constants/color';
import useDetailModal from '@/stores/useModalStore';

interface ModalProps {
  content?: React.ReactElement;
  id: string;
}

export const Modal: React.FC<ModalProps> = ({ content, id }) => {
  const { closeModal } = useDetailModal();
  const modal = useDetailModal((state) => state.modals[id]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modal?.isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [modal?.isOpen, id]);

  if (!modal?.isOpen) return null;

  return (
    <dialog ref={dialogRef} css={modalStyle(modal.width)}>
      <div className='close-btn'>
        <IconButton
          IconComponent={CloseOutlinedIcon}
          iconBgSize='lg'
          shape='none'
          handleClick={() => closeModal(id)}
        />
      </div>
      {content}
    </dialog>
  );
};

const modalStyle = (width?: number) => css`
  position: fixed;
  background: ${COLOR.WHITE};
  border-radius: 4px;
  border: 0;
  padding: 24px;
  width: ${width ? `${width}px` : '336px'};

  .close-btn {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
`;

export default Modal;
