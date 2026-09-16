import React from 'react';
import IPipelineModalProps from '../interfaces/components_interfaces/Stepper/IPipelineModalProps';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCog,
  FaUsers,
} from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';


const defaultSteps = ['Pendiente', 'En Proceso', 'En Comité', 'Aprobada', 'Denegada'];


const defaultColorMap: Record<string, string> = {
  'Pendiente': '#3B82F6',
  'En Proceso': '#F59E0B',
  'En Comité': '#8B5CF6',
  'Aprobada': '#348B00',
  'Denegada': '#D9534F',
};


const defaultIconMap: Record<string, (color: string) => React.ReactNode> = {
 
  'Pendiente': (c: string) => <FaHourglassHalf className="text-2xl md:text-3xl" style={{ color: c }} />,
  'En Proceso': (c: string) => <FaCog className="text-2xl md:text-3xl" style={{ color: c }} />,
  'En Comité': (c: string) => <FaUsers className="text-2xl md:text-3xl" style={{ color: c }} />,
  'Aprobada': (c: string) => <FaCheckCircle className="text-2xl md:text-3xl" style={{ color: c }} />,
  'Denegada': (c: string) => <FaTimesCircle className="text-2xl md:text-3xl" style={{ color: c }} />,
};

const stateAliasMap: Record<string, string> = {
  'revisar': 'En Proceso',
  'en revision': 'En Proceso',
  'revision': 'En Proceso',
  'pendiente': 'Pendiente',
  'aprobado': 'Aprobada',
  'denegado': 'Denegada',
};

const PipelineModal: React.FC<
  IPipelineModalProps & {
    steps?: string[];
    colorMap?: Record<string, string>;
    iconMap?: Record<string, (color: string) => React.ReactNode>;
    title?: string;
    showAll?: boolean; 
  }
> = ({ open, onClose, currentState, steps: stepsProp, colorMap, iconMap, title, showAll = false }) => {
  if (!open) return null;

  const stepsToUse = stepsProp && stepsProp.length ? stepsProp : defaultSteps;
  const colors = { ...defaultColorMap, ...(colorMap || {}) };
  const icons = { ...defaultIconMap, ...(iconMap || {}) } as Record<string, (c: string) => React.ReactNode>;


  const getStepsToShow = (state: string) => {
    if (showAll) return stepsToUse;
    const finalStates = ['Aprobada', 'Denegada'];


    const foundIdx = stepsToUse.findIndex(s => s.toLowerCase() === state?.toLowerCase());
    if (foundIdx === -1) return stepsToUse;


    let list = stepsToUse;
    if (finalStates.includes(state)) {
      const otherFinal = finalStates.find(f => f !== state);
      if (otherFinal) {
        list = stepsToUse.filter(s => s !== otherFinal);
      }
    }

    const idx = list.findIndex(s => s.toLowerCase() === state?.toLowerCase());
    if (idx === -1) return list;

 
    return list.slice(0, idx + 1);
  };


  const normalizedState = (currentState && stateAliasMap[(currentState || '').toLowerCase()])
    ? stateAliasMap[(currentState || '').toLowerCase()]
    : (currentState || '');

  const filteredSteps = getStepsToShow(normalizedState);
  const currentStepIndex = filteredSteps.findIndex(step => step.toLowerCase() === (normalizedState || '').toLowerCase());

  const getStateMessage = (state: string) => {
    switch (state) {
      case 'Pendiente':
        return 'La novedad ha sido registrada y está pendiente de revisión inicial.';
      case 'En Proceso':
        return 'La novedad está siendo revisada por el equipo correspondiente.';
      case 'En Comité':
        return 'La novedad está siendo evaluada por el comité de decisiones.';
      case 'Aprobada':
        return 'La novedad ha sido aprobada exitosamente.';
      case 'Denegada':
        return 'La novedad ha sido denegada.';
      default:
        return 'La novedad está en proceso.';
    }
  };

  const connectorColor = colors[filteredSteps[currentStepIndex] || ''] || '#374151';

  return (
  <div className="fixed -inset-4 flex font-inter items-center justify-center bg-black bg-opacity-10 backdrop-blur-none z-50 transition-all duration-300 dark:bg-transparent-black">
    {/* allow overflow visible so glow/shadows of current step are not clipped on small screens */}
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-[90%] max-w-4xl transform transition-all duration-300 overflow-visible">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex justify-between items-center dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-800">
        <h2 className="text-2xl font-bold dark:text-green-400">{title || 'Estado de la Novedad'}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors focus:outline-none dark:text-gray-300 dark:hover:text-white"
          aria-label="Cerrar"
        >
          <IoCloseOutline size={24} />
        </button>
      </div>
      <div className="p-6 dark:bg-slate-800">
        <div className="flex justify-center items-center mb-8">
          <div className="w-full">
            {(() => {
              const len = filteredSteps.length;
              const cols = len <= 3 ? len : Math.min(4, len);
              return (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, alignItems: 'center', gap: '1rem' }}>
                  {filteredSteps.map((step, index) => {
                    const stepColor = colors[step] || '#9CA3AF';
                    const isStepCompleted = index < currentStepIndex;
                    const isCurrentStep = index === currentStepIndex;
                    const isStepActive = isStepCompleted || isCurrentStep;
                    return (
                      <div key={index} className="flex items-center justify-center">
                        <div className="flex flex-col items-center min-w-[72px] md:min-w-[120px] px-1">
                          <div
                            className={`flex items-center justify-center w-12 md:w-14 h-12 md:h-14 rounded-full transition-all duration-300 ${
                              isStepActive ? 'bg-white dark:bg-slate-700' : 'bg-gray-100 dark:bg-slate-600'
                            }`}
                            style={isCurrentStep ? { boxShadow: `0 0 0 4px ${stepColor}22`, border: `1px solid ${stepColor}` } : { border: isStepActive ? `1px solid ${stepColor}22` : '1px solid transparent' }}
                          >
                            {(icons[step] || defaultIconMap[step])(isStepActive ? stepColor : '#9CA3AF')}
                          </div>
                          <span
                            className={`mt-2 text-sm md:text-base font-medium transition-colors duration-300 text-center break-words dark:text-gray-200`}
                            style={isStepActive ? { color: isStepActive ? stepColor : undefined } : { color: 'inherit' }}
                          >
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
        <div className="mt-8 text-center p-6 md:p-16 rounded-lg bg-gray-50 border border-gray-200 dark:bg-slate-700 dark:border-slate-600">
          <p className="text-gray-600 dark:text-gray-300">
            Estado actual:{' '}
            <span className="font-bold dark:text-green-400" style={{ color: connectorColor }}>
              {normalizedState || currentState}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">{getStateMessage(normalizedState || currentState || '')}</p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2.5 bg-darkGreen hover:bg-hoverGreen text-white rounded-lg transition-colors duration-300 shadow-sm flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkGreen dark:bg-green-700 dark:hover:bg-green-800 dark:text-white"
            onClick={onClose}
          >
            <span>Entendido</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PipelineModal;