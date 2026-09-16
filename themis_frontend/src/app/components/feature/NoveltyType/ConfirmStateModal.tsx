import React from 'react';
//import { Modal, ModalProps } from '@/app/components/ui/Modal';
import { Modal, ModalProps } from '@/components/ui/Modal';
interface ConfirmStateModalProps extends Omit<ModalProps, 'children'> {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noveltyName: string;
  noveltyState: boolean;
  darkMode?: boolean;
}

const ConfirmStateModal: React.FC<ConfirmStateModalProps> = ({
  open,
  onClose,
  onConfirm,
  noveltyName,
  noveltyState,
  darkMode = false,
  ...props
}) => (
  <Modal open={open} onClose={onClose} {...props}>
    <div className="w-[90%] max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className={`bg-gradient-to-r ${darkMode ? 'border-gray-700 from-[#00304D] to-[#005386]' : 'border-gray-200 from-[#398f0d] to-lime-500'} text-white py-4 px-6 rounded-t-2xl`}>
        <h2 className="text-xl font-bold">Confirmar Cambio de Estado</h2>
      </div>
      <div className="p-6">
        <p className="text-gray-700 mb-6">
          ¿Estás seguro que deseas {noveltyState ? 'desactivar' : 'activar'} el tipo de novedad <span className="font-semibold">{noveltyName}</span>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className={`px-5 py-3 rounded-lg shadow-md transition-all duration-200 font-medium ${noveltyState ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-darkGreen hover:bg-green-600 text-white'}`}
          >
            {noveltyState ? 'Desactivar' : 'Activar'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition-all duration-200 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Modal>
);

export default ConfirmStateModal;
