import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
interface AddCardProps {
  onClick: () => void;
  darkMode: boolean;
}

const AddCard: React.FC<AddCardProps> = ({ onClick, darkMode }) => (
  <Card
    onClick={onClick}
    variant="outlined"
    theme={darkMode ? 'dark' : 'light'}
    size="md"
    className="bg-gradient-to-br from-gray-400 to-gray-500 flex justify-center items-center text-center cursor-pointer hover:from-gray-500 hover:to-gray-600 border border-white/10 group"
  >
    <CardContent>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-200">
          <span className="text-3xl text-white">+</span>
        </div>
        <h1 className="font-medium text-[20px] text-white">Agregar</h1>
      </div>
    </CardContent>
  </Card>
);

export default AddCard;
