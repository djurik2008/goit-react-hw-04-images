import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ close, children }) => {
  const closeModal = ({ target, currentTarget, code }) => {
    if (target === currentTarget || code === 'Escape') {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', closeModal);
    return () => document.removeEventListener('keydown', closeModal);
  });

  return createPortal(
    <div onClick={closeModal} className={css.overlay}>
      <div className={css.modal}>
        <p onClick={close} className={css.close}>
          <span className={css.closeLabel}>Close</span>
        </p>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
