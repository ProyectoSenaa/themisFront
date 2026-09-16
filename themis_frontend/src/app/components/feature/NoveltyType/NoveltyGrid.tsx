import React from 'react';
import INoveltyType from '../../../interfaces/components_interfaces/CardA_&_CardSA/INoveltyType';
import NoveltyCard from './NoveltyCard';
import AddCard from './AddCard';

interface NoveltyGridProps {
  items: INoveltyType[];
  darkMode: boolean;
  onUpdateClick: (id: number) => void;
  onInfoClick: (item: INoveltyType) => void;
  onRegisterClick: (item: INoveltyType) => void;
  onAddClick: () => void;
  showAddCard?: boolean; // Nueva prop para controlar si mostrar la tarjeta agregar
}

const NoveltyGrid: React.FC<NoveltyGridProps> = ({ 
  items, 
  darkMode, 
  onUpdateClick, 
  onInfoClick, 
  onRegisterClick, 
  onAddClick, 
  showAddCard = true 
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 lg:mt-4 w-full px-4">
    {items.map(item => (
      <NoveltyCard
        key={item.id}
        item={item}
        darkMode={darkMode}
        onUpdateClick={onUpdateClick}
        onInfoClick={onInfoClick}
        onRegisterClick={onRegisterClick}
      />
    ))}
    {showAddCard && <AddCard onClick={onAddClick} darkMode={darkMode} />}
  </div>
);

export default NoveltyGrid;
