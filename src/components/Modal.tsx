import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@/components/IconButton';
import { COLOR } from '@/constants/color';
import { useModalStore } from '@/stores/useModalStore';

interface ModalProps {
  width?: number;
}

const Modal: React.FC<ModalProps> = ({ width = 336 }) => {
  const { isOpen, content, closeModal } = useModalStore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} css={modalStyle(width)}>
      <div className='close-btn'>
        <IconButton
          IconComponent={CloseOutlinedIcon}
          iconBgSize='lg'
          shape='clear'
          handleClick={closeModal}
        />
      </div>
      {content}
    </dialog>
  );
};

const modalStyle = (width: number) => css`
  position: relative;
  background: ${COLOR.WHITE};
  border-radius: 4px;
  width: ${width}px;
  border: 0;
  padding: 24px;

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
