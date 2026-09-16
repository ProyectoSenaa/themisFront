import { useState } from 'react';

export const useModalState = (initialState = false) => {
  const [open, setOpen] = useState(initialState);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return { open, openModal, closeModal };
};

export default useModalState;
