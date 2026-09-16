import React from 'react';
import Button from '@/components/ui/button';
import { Users, Calendar, FileText, Plus } from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onCreateCommittee: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onCreateCommittee,
}) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8 items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-950 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <Button
          onClick={() => onViewChange("dashboard")}
          variant="ghost"
          className={`flex items-center gap-2 transition-all duration-200 ${currentView === "dashboard" ? "bg-gray-100 dark:bg-gray-800 shadow-sm font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
        >
          <Users size={18} />
          Dashboard
        </Button>
        <Button
          onClick={() => onViewChange("calendar")}
          variant="ghost"
          className={`flex items-center gap-2 transition-all duration-200 ${currentView === "calendar" ? "bg-gray-100 dark:bg-gray-800 shadow-sm font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
        >
          <Calendar size={18} />
          Calendario
        </Button>
        <Button
          onClick={() => onViewChange("committees")}
          variant="ghost"
          className={`flex items-center gap-2 transition-all duration-200 ${currentView === "committees" ? "bg-gray-100 dark:bg-gray-800 shadow-sm font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`}
        >
          <FileText size={18} />
          Comités
        </Button>
      </div>

      <Button
        onClick={onCreateCommittee}
        className="flex items-center gap-2 bg-[#398f0d] hover:bg-[#2f7a0b] text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6"
      >
        <Plus size={18} />
        Nuevo Comité
      </Button>
    </div>
  );
};
