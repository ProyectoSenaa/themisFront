import React, { useState } from "react"

export interface DateRange {
  from?: Date
  to?: Date
}

export interface DateRangeInputProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const formatDateRange = () => {
    if (!value?.from && !value?.to) return "Seleccionar rango"
    if (value?.from && !value?.to) return value.from.toLocaleDateString()
    if (value?.from && value?.to) return `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`
    return "Seleccionar rango"
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={`${!value?.from && !value?.to ? "text-gray-400" : "text-gray-700"}`}>{formatDateRange()}</span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Desde</label>
              <input
                type="date"
                value={value.from ? value.from.toISOString().substring(0, 10) : ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    from: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
              <input
                type="date"
                value={value.to ? value.to.toISOString().substring(0, 10) : ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    to: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  )
}

export default DateRangeInput;
