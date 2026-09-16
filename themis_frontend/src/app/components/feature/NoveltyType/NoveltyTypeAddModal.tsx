import React from 'react';
//import { Modal, ModalProps } from '@/app/components/ui/Modal';
import {Modal} from '@/components/ui/Modal';
import { ModalProps } from '@/components/ui/Modal';
interface NoveltyTypeAddModalProps extends Omit<ModalProps, 'children'> {
  open: boolean;
  onClose: () => void;
  title: string;
  darkMode?: boolean;
  children: React.ReactNode;
}

const NoveltyTypeAddModal: React.FC<NoveltyTypeAddModalProps> = ({
  open,
  onClose,
  title,
  darkMode = false,
  children,
  ...props
}) => (
  <Modal open={open} onClose={onClose} {...props}>
    <div className="max-h-[90vh] w-screen sm:max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl border-0">
      <div className={`bg-gradient-to-r ${darkMode ? "border-gray-700 from-[#00304D] to-[#005386]" : "border-gray-200 from-[#398f0d] to-lime-500"} text-white py-4 px-6 rounded-t-2xl flex justify-between items-center`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Cerrar modal"
          type="button"
        >
          <span style={{ fontSize: 28 }}>×</span>
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </Modal>
);

export default NoveltyTypeAddModal;
