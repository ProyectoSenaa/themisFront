import React from 'react';
import {Modal} from '@/components/ui/Modal';
import { ModalProps } from '@/components/ui/Modal';
interface NoveltyTypeDetailsModalProps extends Omit<ModalProps, 'children'> {
  open: boolean;
  onClose: () => void;
  novelty?: {
    nameNovelty?: string;
    noveltyState?: boolean;
    procedureDescription?: string;
    description?: string;
  };
  darkMode?: boolean;
}

const NoveltyTypeDetailsModal: React.FC<NoveltyTypeDetailsModalProps> = ({
  open,
  onClose,
  novelty,
  darkMode = false,
  ...props
}) => (
  <Modal open={open} onClose={onClose} {...props}>
    <div className="max-h-[90vh] w-full sm:max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl border-0">
      <div className={`bg-gradient-to-r ${darkMode ? "border-gray-700 from-[#00304D] to-[#005386]" : "border-gray-200 from-[#398f0d] to-lime-500"} text-white py-4 px-6 rounded-t-2xl flex justify-between items-center`}>
        <h2 className="text-xl font-bold">Detalles de la Novedad</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <span style={{fontSize: 28}}>×</span>
        </button>
      </div>
      <div className="p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{novelty?.nameNovelty}</h3>
          <p className="text-sm text-gray-500">
            Estado: <span className={`font-medium ${novelty?.noveltyState ? 'text-green-600' : 'text-red-600'}`}>{novelty?.noveltyState ? 'Activo' : 'Inactivo'}</span>
          </p>
        </div>
        <div className="mb-5">
          <h4 className="text-md font-medium text-gray-700 mb-2">¿En qué momento se puede tramitar?</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{novelty?.procedureDescription || "No especificado"}</p>
        </div>
        <div className="mb-5">
          <h4 className="text-md font-medium text-gray-700 mb-2">Descripción</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{novelty?.description || "No hay descripción disponible"}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 shadow-md transition-all duration-200 text-sm font-medium"
        >
          Cerrar
        </button>
      </div>
    </div>
  </Modal>
);

export default NoveltyTypeDetailsModal;
