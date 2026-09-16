import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { FollowUpStatus } from '@/app/interfaces/followUp'
import { ChevronDown, Loader, CheckCircle, XCircle, Clock, BarChart2, Zap } from 'lucide-react'

// Define un mapeo de colores e íconos más ricos para los estados
const getStatusVisuals = (statusName: string, darkMode: boolean) => {
  const name = statusName.toLowerCase().replace(/[^a-z0-9]/g, '') // Limpiar tildes y espacios
  
  // Clases comunes base
  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
  const darkText = darkMode ? "text-gray-100" : "text-gray-900"
  
  let colorClasses = ""
  let icon = null
  
  if (name.includes('abierto') || name.includes('pendiente')) {
    // Abierto/Pendiente - Amarillo/Naranja (Espera)
    colorClasses = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    icon = <Clock className="w-3 h-3" />
  } else if (name.includes('revision') || name.includes('proceso')) {
    // En Revisión/Proceso - Azul (Trabajando)
    colorClasses = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    icon = <Loader className="w-3 h-3 animate-spin-slow" />
  } else if (name.includes('resuelto') || name.includes('cerrado')) {
    // Resuelto/Cerrado - Verde (Éxito)
  colorClasses = "bg-green-100 text-green-800 dark:bg-blue-900 dark:text-blue-300"
    icon = <CheckCircle className="w-3 h-3" />
  } else if (name.includes('cancelamiento') || name.includes('rechazado')) {
    // Cancelado/Rechazado - Rojo (Fallo)
    colorClasses = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    icon = <XCircle className="w-3 h-3" />
  } else if (name.includes('aplazamiento')) {
    // Aplazamiento - Púrpura (Pausa)
    colorClasses = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    icon = <Clock className="w-3 h-3" />
  } else if (name.includes('condicionamiento') || name.includes('mejoramiento')) {
    // Condicionamiento/Mejoramiento - Teal (Mejora)
    colorClasses = "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
    icon = <BarChart2 className="w-3 h-3" />
  } else {
    // Por defecto - Gris
    colorClasses = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
    icon = <Zap className="w-3 h-3" />
  }

  return { 
    classes: `${baseClasses} ${colorClasses}`, 
    icon,
    textClass: darkText // Para el texto dentro del dropdown
  }
}

interface StatusSelectProps {
  currentStatusId: string
  statuses: FollowUpStatus[]
  onStatusChange: (statusId: string) => void
  darkMode: boolean
  disabled?: boolean
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  currentStatusId,
  statuses,
  onStatusChange,
  darkMode,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'down' | 'up'>('down')
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Calculate dropdown position based on available space
  const calculateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const spaceBelow = windowHeight - rect.bottom
      const spaceAbove = rect.top
      const dropdownHeight = statuses.length * 40 + 16 // Approximate dropdown height
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('up')
      } else {
        setDropdownPosition('down')
      }
    }
  }, [statuses.length])

  // Update position when opening
  const handleToggle = useCallback(() => {
    if (!disabled) {
      if (!isOpen) {
        calculateDropdownPosition()
      }
      setIsOpen(!isOpen)
    }
  }, [disabled, isOpen, calculateDropdownPosition])

  // Encuentra el estado actual para mostrarlo en el botón
  const currentStatus = useMemo(
    () => statuses.find(s => s.id === currentStatusId),
    [statuses, currentStatusId]
  )
  
  // Obtiene las clases y el ícono del estado actual
  const currentVisuals = getStatusVisuals(currentStatus?.name || 'Desconocido', darkMode)

  const handleSelect = useCallback((statusId: string) => {
    onStatusChange(statusId)
    setIsOpen(false)
  }, [onStatusChange])

  // Clases del contenedor
  const dropdownClasses = darkMode
    ? "bg-gray-700 border border-gray-600 shadow-xl"
    : "bg-white border border-gray-200 shadow-lg"
  
  // Clases del botón principal
  const buttonBaseClasses = `transition duration-150 ease-in-out flex items-center justify-between min-w-[120px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`

  return (
    <div ref={containerRef} className="relative inline-block text-left" style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {/* Botón/Display del Estado Actual */}
      <button
        type="button"
        onClick={handleToggle}
        className={`${buttonBaseClasses} ${currentVisuals.classes} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 cursor-pointer'}`}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentVisuals.icon}
        <span className="truncate max-w-[120px]">{currentStatus?.name || 'Seleccionar Estado'}</span>
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* Menú Desplegable de Opciones */}
      {isOpen && (
        <>
          {/* Backdrop para cerrar al hacer click fuera */}
          <div 
            className="fixed inset-0" 
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`absolute left-0 ${dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 rounded-lg ${dropdownClasses} origin-top-left transform transition ease-out duration-200 shadow-xl border`}
            style={{ 
              transform: 'scale(1)', 
              opacity: 1, 
              zIndex: 9999,
              position: 'absolute'
            }}
          >
            <div 
              className="py-1" 
              role="menu" 
              aria-orientation="vertical" 
              aria-labelledby="status-menu-button"
            >
              {statuses.map((status) => {
                const { icon, textClass } = getStatusVisuals(status.name, darkMode)
                const isSelected = status.id === currentStatusId
                
                return (
                  <button
                    key={status.id}
                    onClick={() => handleSelect(status.id)}
                    className={`
                      ${textClass}
                      ${isSelected ? 'font-bold bg-green-50 dark:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}
                      ${status.id === currentStatusId ? 'text-green-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                      w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-100
                    `}
                    role="menuitem"
                  >
                    {icon}
                    {status.name}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
