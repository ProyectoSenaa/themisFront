import React from 'react';
import NoveltyTypeAddModal from './NoveltyTypeAddModal';
import NoveltyTypeDetailsModal from './NoveltyTypeDetailsModal';
import ConfirmStateModal from './ConfirmStateModal';
import INoveltyType from '../../../interfaces/components_interfaces/CardA_&_CardSA/INoveltyType';

interface NoveltyModalsProps {
  addOpen: boolean;
  onAddClose: () => void;
  detailsOpen: boolean;
  onDetailsClose: () => void;
  detailsNovelty?: INoveltyType;
  confirmOpen: boolean;
  onConfirmClose: () => void;
  onConfirm: () => void;
  confirmNoveltyName: string;
  confirmNoveltyState: boolean;
  children?: React.ReactNode;
}

const NoveltyModals: React.FC<NoveltyModalsProps> = ({
  addOpen, onAddClose,
  detailsOpen, onDetailsClose, detailsNovelty,
  confirmOpen, onConfirmClose, onConfirm, confirmNoveltyName, confirmNoveltyState,
  children
}) => (
  <>
    <NoveltyTypeAddModal open={addOpen} onClose={onAddClose} title="Agregar Nueva Novedad">{children}</NoveltyTypeAddModal>
    <NoveltyTypeDetailsModal open={detailsOpen} onClose={onDetailsClose} novelty={detailsNovelty} />
    <ConfirmStateModal open={confirmOpen} onClose={onConfirmClose} onConfirm={onConfirm} noveltyName={confirmNoveltyName} noveltyState={confirmNoveltyState} />
  </>
);

export default NoveltyModals;
