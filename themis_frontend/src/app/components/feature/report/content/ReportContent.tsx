"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useState, useEffect } from "react"
import {
  FileText,
  Filter,
  XCircle,
  ChevronDown,
  Calendar,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  Activity,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts"
import React, { Children, isValidElement } from "react"
import dynamic from 'next/dynamic'
import ReportModal from "@/app/components/ReportModal"
import { useQuery } from '@apollo/client'
import { GET_NOVELTY } from '@/app/graphqlServices/noveltyGraphql'

// Using Apollo GET_NOVELTY query from graphqlServices/noveltyGraphql.tsx

interface SelectItemProps {
  value: string
  children?: React.ReactNode
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  className?: string
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", variant = "default", ...props }) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 shadow-md hover:shadow-lg"
  const variants: Record<string, string> = {
    default: darkMode
      ? "bg-gradient-to-r from-[#00304D] to-[#005386] text-white hover:from-[#005386] hover:to-[#00304D] focus:ring-blue-500"
      : "bg-gradient-to-r from-[#398f0d] to-[#84cc16] text-white hover:from-[#84cc16] hover:to-[#398f0d] focus:ring-green-500",
    outline:
      "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-200",
  }
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

interface BasicProps {
  children?: React.ReactNode
  className?: string
}

const Card: React.FC<BasicProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm dark:bg-[#232b3b] dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
)

const CardHeader: React.FC<BasicProps> = ({ children, className = "" }) => (
  <div className={`px-8 py-6 border-b border-gray-100 dark:border-gray-700 ${className}`}>{children}</div>
)

const CardTitle: React.FC<BasicProps> = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-3 dark:text-white ${className}`}>{children}</h3>
)

const CardDescription: React.FC<BasicProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-2 leading-relaxed dark:text-gray-200 ${className}`}>{children}</p>
)

const CardContent: React.FC<BasicProps> = ({ children, className = "" }) => (
  <div className={`px-8 py-6 ${className}`}>{children}</div>
)

interface SelectProps {
  value?: string
  onValueChange: (value?: string) => void
  children?: React.ReactNode
  placeholder?: string
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState("")

  useEffect(() => {
    if (!value) {
      setSelectedLabel("")
      return
    }
    const childArray = Children.toArray(children)
    const selectedChild = childArray.find((child) => {
      return isValidElement<SelectItemProps>(child) && child.props.value === value
    }) as React.ReactElement<SelectItemProps> | undefined

    if (selectedChild) {
      const label = selectedChild.props.children
      setSelectedLabel(typeof label === "string" ? label : String(label))
    }
  }, [value, children])

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue === "" ? undefined : selectedValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-left text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-[#232b3b] dark:text-white dark:border-[#3a4252]"
      >
        <span className={`${!value ? "text-gray-400 dark:text-gray-300" : "text-gray-700 dark:text-white"} font-medium`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-gray-200 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto backdrop-blur-sm dark:bg-[#232b3b] dark:border-[#3a4252]">
          <div className="py-2">
            <button
              onClick={() => handleSelect("")}
              className="w-full px-4 py-3 text-left text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#232b3b]/80 focus:outline-none focus:bg-gray-50 transition-colors duration-150 font-medium"
            >
              {placeholder}
            </button>
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return null
              return (
                <button
                  key={child.props.value}
                  onClick={() => handleSelect(child.props.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#232b3b]/80 focus:outline-none focus:bg-gray-50 transition-colors duration-150 font-medium ${value === child.props.value
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-700 dark:text-white"
                    }`}
                >
                  {child.props.children}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => <option value={value}>{children}</option>

interface AlertProps {
  children?: React.ReactNode
  variant?: "default" | "destructive"
  className?: string
}

const Alert: React.FC<AlertProps> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-green-50 border-2 border-green-200 text-green-800 shadow-lg",
    destructive: "bg-red-50 border-2 border-red-200 text-red-800 shadow-lg",
  }
  return (
    <div
      className={`${variants[variant]} ${className} rounded-xl p-4 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300`}
    >
      {children}
    </div>
  )
}

const AlertTitle: React.FC<BasicProps> = ({ children, className = "" }) => (
  <h5 className={`font-bold text-lg ${className}`}>{children}</h5>
)

const AlertDescription: React.FC<BasicProps> = ({ children, className = "" }) => (
  <div className={`mt-2 text-sm font-medium ${className}`}>{children}</div>
)

interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangeInputProps {
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
        className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-[#232b3b] dark:text-white dark:border-[#3a4252]"
      >
        <span className={`${!value?.from && !value?.to ? "text-gray-400 dark:text-gray-300" : "text-gray-700 dark:text-white"} font-medium`}>
          {formatDateRange()}
        </span>
        <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-200" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 backdrop-blur-sm dark:bg-[#232b3b] dark:border-[#3a4252]">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide dark:text-white">Desde</label>
              <input
                type="date"
                value={value.from ? value.from.toISOString().substring(0, 10) : ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    from: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium dark:bg-[#232b3b] dark:text-white dark:border-[#3a4252]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide dark:text-white">Hasta</label>
              <input
                type="date"
                value={value.to ? value.to.toISOString().substring(0, 10) : ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    to: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium dark:bg-[#232b3b] dark:text-white dark:border-[#3a4252]"
              />
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Aplicar Fechas
          </button>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
  if (!status) return '#6366f1'
  const s = String(status).toLowerCase().trim()

  const map: Record<string, string> = {
    abierto: '#ef4444',
    pendiente: '#3b82f6',
    'en progreso': '#f59e0b',
    en_progreso: '#f59e0b',
    enprogreso: '#f59e0b',
    cerrado: '#10b981',
    aprobado: '#06b6d4',
    denegado: '#ef4444',
    'en commite': '#9ca3af',
    'en revisión': '#8b5cf6',
    revision: '#8b5cf6',
    'en espera': '#f97316',
    'anulado': '#ef4444',
  }

  if (map[s]) return map[s]

  const hash = Array.from(s).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0)
  const idx = Math.abs(hash) % barColors.length
  return barColors[idx]
}

function formatStatusName(raw?: string) {
  if (!raw) return 'En commite'
  const cleaned = String(raw).replace(/_/g, ' ').trim()
  if (cleaned.toLowerCase() === 'en commite' || cleaned.toLowerCase() === 'en_commite') return 'En commite'
  return cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

// Colores vibrantes para el gráfico de barras
const barColors = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]

    const itemName = label ?? item?.payload?.name ?? item?.name ?? 'En commite'
    const value = item?.value ?? item?.payload?.value ?? 0

    return (
      <div className="bg-white p-4 border-2 border-gray-200 rounded-xl shadow-xl backdrop-blur-sm">
        <p className="font-bold text-gray-800">{String(itemName)}</p>
        <p className="text-green-600 font-semibold">{`Cantidad: ${value}`}</p>
      </div>
    )
  }
  return null
}

const NoveltyTypeBarChart = ({ typeCounts }: { typeCounts: { noveltyTypeName: string; count: number }[] }) => {
  const barHeight = 40
  const minChartHeight = 300
  const verticalPadding = 100


  const dynamicHeight = Math.max(minChartHeight, typeCounts.length * barHeight + verticalPadding)

  return (
    <ResponsiveContainer width="100%" height={dynamicHeight}>
      <BarChart
        data={typeCounts.map((tc, index) => ({
          name: tc.noveltyTypeName,
          value: tc.count,
          fill: barColors[index % barColors.length],
        }))}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 11, fill: "#666", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <XAxis
          dataKey="value"
          type="number"
          tick={{ fontSize: 12, fill: "#666", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={2} stroke="#fff">
          {typeCounts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

const StatsCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
  <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:from-[#232b3b]/80 dark:to-[#3a4252]/70 dark:border-[#3a4252]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-1 dark:text-white">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl`} style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
    </div>
  </div>
)

export default function ReportContent() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const openReportModal = () => {
    setIsReportModalOpen(true)
  }
  const [noveltyType, setNoveltyType] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [alertMessage, setAlertMessage] = useState("")
  const [typeCounts, setTypeCounts] = useState<{ noveltyTypeName: string; count: number }[]>([])
  const [statusCounts, setStatusCounts] = useState<{ name: string; value: number; color: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_NOVELTY, {
    variables: { page: 0, size: 1000 },
    fetchPolicy: 'network-only',
  })

  // Helper to compute filtered novelties (used for charts and exports)
  const getFilteredNovelties = () => {
    const novelties = data?.allNovelties?.data || []
    let filtered = [...novelties]
    if (noveltyType) {
      filtered = filtered.filter(
        (n: any) => n.noveltyType?.nameNovelty?.toLowerCase() === noveltyType.toLowerCase(),
      )
    }
    if (status) {
      filtered = filtered.filter(
        (n: any) => (n.noveltyStatus?.name || '').toLowerCase() === status.toLowerCase(),
      )
    }
    const fromDate = dateRange.from ? new Date(dateRange.from) : undefined
    const toDate = dateRange.to ? new Date(dateRange.to) : undefined
    if (fromDate) fromDate.setHours(0, 0, 0, 0)
    if (toDate) toDate.setHours(23, 59, 59, 999)
    if (fromDate || toDate) {
      filtered = filtered.filter((n: any) => {
        if (!n.date) return false
        const date = new Date(n.date)
        if (fromDate && date < fromDate) return false
        if (toDate && date > toDate) return false
        return true
      })
    }
    return filtered
  }

  const getCreatorName = (n: any) => {
    // try common locations for creator/person
    if (!n) return 'Sistema'
    if (n.student?.person) return `${n.student.person.name || ''} ${n.student.person.lastname || ''}`.trim()
    if (n.teacher?.person) return `${n.teacher.person.name || ''} ${n.teacher.person.lastname || ''}`.trim()
    if (n.administrative?.person) return `${n.administrative.person.name || ''} ${n.administrative.person.lastname || ''}`.trim()
    if (n.createdBy?.fk_id_person) return `${n.createdBy.fk_id_person.name || ''} ${n.createdBy.fk_id_person.lastname || ''}`.trim()
    if (n.fk_id_person) return `${n.fk_id_person.name || ''} ${n.fk_id_person.lastname || ''}`.trim()
    if (n.createdBy?.name) return n.createdBy.name
    if (n.user?.name) return n.user.name
    return 'Sistema'
  }

  const getFichaNumber = (n: any) => {
    // Prefer studySheet number if available
    try {
      const ss = n?.student?.studentStudySheets
      if (ss && ss.length > 0 && ss[0]?.studySheet?.number) return ss[0].studySheet.number
    } catch (e) {
      // ignore
    }
    // fallback to student id or other ids
    return n?.student?.id || n?.fk_id_person?.id || n?.createdBy?.id || ''
  }

  useEffect(() => {
    setLoading(!!queryLoading)
    setError(queryError ? (queryError as any).message : null)
  }, [queryLoading, queryError])

  useEffect(() => {
    const novelties = data?.allNovelties?.data || []


    let filteredNovelties = [...novelties]

    if (noveltyType) {
      filteredNovelties = filteredNovelties.filter(
        (n: any) => n.noveltyType?.nameNovelty?.toLowerCase() === noveltyType.toLowerCase(),
      )
    }
    if (status) {
      filteredNovelties = filteredNovelties.filter(
        (n: any) => (n.noveltyStatus?.name || '').toLowerCase() === status.toLowerCase(),
      )
    }


    const fromDate = dateRange.from ? new Date(dateRange.from) : undefined
    const toDate = dateRange.to ? new Date(dateRange.to) : undefined
    if (fromDate) fromDate.setHours(0, 0, 0, 0)
    if (toDate) toDate.setHours(23, 59, 59, 999)

    if (fromDate || toDate) {
      filteredNovelties = filteredNovelties.filter((n: any) => {
        if (!n.date) return false
        const date = new Date(n.date)
        if (fromDate && date < fromDate) return false
        if (toDate && date > toDate) return false
        return true
      })
    }

    // Now compute type counts from filtered novelties so bar chart reflects filters
    const typeCountsMap: Record<string, number> = {}
    for (const n of filteredNovelties) {
      const typeName = n.noveltyType?.nameNovelty || 'Sin tipo'
      typeCountsMap[typeName] = (typeCountsMap[typeName] || 0) + 1
    }
    const calculatedTypeCounts = Object.entries(typeCountsMap).map(([noveltyTypeName, count]) => ({
      id: noveltyTypeName,
      noveltyTypeName,
      count,
    }))
    setTypeCounts(calculatedTypeCounts)


    const statusMap: Record<string, number> = {}
    for (const n of filteredNovelties) {
      const key = n.noveltyStatus?.name || 'Desconocido'
      statusMap[key] = (statusMap[key] || 0) + 1
    }
    const statusData = Object.entries(statusMap).map(([name, value]) => {
      const displayName = formatStatusName(name)
      return {
        name: displayName,
        value,
        color: getStatusColor(name),
      }
    })
    setStatusCounts(statusData)
  }, [data, noveltyType, status, dateRange.from, dateRange.to])


  const exportToExcel = async (meta?: any) => {
    const XLSX = await import('xlsx')
    const wb = XLSX.utils.book_new()

    // Build a single sheet: metadata rows, blank row, then headers + detail rows
    const rows: any[] = []
    rows.push(['Generado por', meta?.createdBy || 'Usuario'])
    rows.push(['Fecha generación', meta?.generatedAt || new Date().toISOString()])
    rows.push(['Tipo filtro', meta?.filters?.noveltyType || 'Todos'])
    rows.push(['Estado filtro', meta?.filters?.status || 'Todos'])
    rows.push(['Rango desde', meta?.filters?.from || ''])
    rows.push(['Rango hasta', meta?.filters?.to || ''])
    rows.push([])

    // Header for details
    rows.push(['Fecha', 'Tipo', 'Estado', 'Creado por', 'Ficha'])

    // Add detail rows
    const details = getFilteredNovelties()
    for (const n of details) {
      rows.push([
        n.date ? new Date(n.date).toLocaleString() : '',
        n.noveltyType?.nameNovelty || '',
        formatStatusName(n.noveltyStatus?.name),
        getCreatorName(n),
        getFichaNumber(n),
      ])
    }

    const ws = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buf], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async (meta?: any) => {
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    // Header with theme color similar to page (green gradient approximation)
    doc.setFillColor(56, 161, 105) // emerald-500
    doc.rect(0, 0, 595, 60, 'F')
    doc.setFontSize(18)
    doc.setTextColor(255, 255, 255)
    doc.text('Reporte de Novedades', 40, 40)

    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(`Generado por: ${meta?.createdBy || 'Usuario'}`, 380, 25)
    doc.text(`Fecha: ${new Date(meta?.generatedAt || Date.now()).toLocaleString()}`, 380, 40)

    // Metadata box
    doc.setDrawColor(230, 230, 230)
    doc.setFillColor(245, 245, 245)
    doc.rect(40, 70, 515, 50, 'F')
    doc.setTextColor(30, 30, 30)
    doc.text(`Tipo: ${meta?.filters?.noveltyType || 'Todos'}`, 50, 90)
    doc.text(`Estado: ${meta?.filters?.status || 'Todos'}`, 50, 105)
    doc.text(`Periodo: ${meta?.filters?.from ? new Date(meta.filters.from).toLocaleDateString() : '-'} - ${meta?.filters?.to ? new Date(meta.filters.to).toLocaleDateString() : '-'}`, 300, 90)

    // Tipos table
    const typesHeader = [['Tipo', 'Cantidad']]
    const typesBody = typeCounts.map((t) => [t.noveltyTypeName, t.count])
    autoTable(doc, { startY: 140, head: typesHeader, body: typesBody, theme: 'grid', headStyles: { fillColor: [56, 161, 105], textColor: 255 } })

    // Detailed rows in the PDF after tipos
    const detailsHeader = [['Fecha', 'Tipo', 'Estado', 'Creado por', 'Ficha']]
    const detailsBody = getFilteredNovelties().map((n: any) => [
      n.date ? new Date(n.date).toLocaleString() : '',
      n.noveltyType?.nameNovelty || '',
      formatStatusName(n.noveltyStatus?.name),
      n.student?.person ? `${n.student.person.name} ${n.student.person.lastname}` : (n.teacher?.person ? `${n.teacher.person.name} ${n.teacher.person.lastname}` : 'Sistema'),
      n.student?.id || n.fk_id_person?.id || n.createdBy?.id || '',
    ])
    doc.addPage()
    doc.setFontSize(12)
    doc.setTextColor(30, 30, 30)
    doc.text('Detalles', 40, 40)
    autoTable(doc, { startY: 60, head: detailsHeader, body: detailsBody, theme: 'striped', headStyles: { fillColor: [56, 161, 105], textColor: 255 } })

    // Estados table on next page if needed
    doc.addPage()
    doc.setFillColor(56, 161, 105)
    doc.rect(0, 0, 595, 60, 'F')
    doc.setTextColor(255)
    doc.setFontSize(14)
    doc.text('Resumen por Estados', 40, 40)
    const statusHeader = [['Estado', 'Cantidad']]
    const statusBody = statusCounts.map((s) => [s.name, s.value])
    autoTable(doc, { startY: 70, head: statusHeader, body: statusBody, theme: 'grid', headStyles: { fillColor: [56, 161, 105], textColor: 255 } })

    doc.save(`report_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const handleApplyFilters = () => {
    setAlertType("success")
    setAlertMessage("✨ Filtros aplicados correctamente. Los gráficos se han actualizado.")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 4000)
    // trigger refetch from Apollo
    try {
      ; (refetch as any)?.()
    } catch (e) {
      // ignore
    }
  }

  const handleClearFilters = () => {
    setNoveltyType(undefined)
    setStatus(undefined)
    setDateRange({ from: undefined, to: undefined })
    setAlertType("success")
    setAlertMessage("🔄 Filtros limpiados. Los gráficos muestran todos los datos.")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 4000)
    // trigger refetch from Apollo
    try {
      ; (refetch as any)?.()
    } catch (e) {
      // ignore
    }
  }

  const NoveltyStatusPieChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusCounts}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={8}
            dataKey="value"
            nameKey="name"
            strokeWidth={3}
            stroke="#fff"
          >
            {statusCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: "#666", fontSize: "12px", fontWeight: "600" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )

  const totalNovelties = typeCounts.reduce((sum, item) => sum + item.count, 0)
  const totalByStatus = statusCounts.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-[#181f2a] dark:to-[#232b3b]">
      {/* Header mejorado */}
      <div className="text-center space-y-4 py-4 sm:py-8">
        <div className="flex justify-center pt-1">
          <div className="flex items-center gap-3">
            <Button onClick={openReportModal} className="gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm w-full sm:w-auto">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Generar Reportes
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          filters={{ noveltyType, status, dateRange }}
          exportToExcel={exportToExcel}
          exportToPDF={exportToPDF}
        />
      )}

      {/* Alert mejorado */}
      {showAlert && (
        <Alert variant={alertType === "error" ? "destructive" : "default"}>
          <div className="flex items-center gap-3">
            {alertType === "error" ? <XCircle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
            <AlertTitle>{alertType === "error" ? "Error en el Sistema" : "Operación Exitosa"}</AlertTitle>
          </div>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard title="Total Novedades" value={totalNovelties} icon={Activity} color="#3b82f6" />
        <StatsCard title="Estados Activos" value={statusCounts.length} icon={PieChartIcon} color="#10b981" />
        <StatsCard title="Tipos Registrados" value={typeCounts.length} icon={BarChart3} color="#f59e0b" />
      </div>

      {/* Filtros mejorados - Responsive */}
      <Card className="relative z-10">
        <CardHeader className="px-4 sm:px-8 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl">Centro de Filtros Avanzados</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="space-y-3">
              <label className="text-s sm:text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Tipo de Novedad
              </label>
              <Select value={noveltyType} onValueChange={setNoveltyType} placeholder="Seleccionar tipo">
                <SelectItem value="Aplazamiento"> Aplazamiento</SelectItem>
                <SelectItem value="Reingreso"> Reingreso</SelectItem>
                <SelectItem value="Deserción"> Deserción</SelectItem>
                <SelectItem value="Cancelación de Matrícula"> Cancelación de Matrícula</SelectItem>
                <SelectItem value="Retiro Voluntario">Retiro Voluntario</SelectItem>
                <SelectItem value="inspeccion">Inspección</SelectItem>
                <SelectItem value="Cond">Cond de Matrícula</SelectItem>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-s sm:text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Estado
              </label>
              <Select value={status} onValueChange={setStatus} placeholder=" Seleccionar estado">
                <SelectItem value="abierto">Pendiente</SelectItem>
                <SelectItem value="en_progreso"> Aprobado</SelectItem>
                <SelectItem value="cerrado"> Denegado</SelectItem>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-s sm:text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Rango de Fechas
              </label>
              <DateRangeInput value={dateRange} onChange={setDateRange} />
            </div>
            <div className="flex flex-col justify-end gap-3">
              <Button onClick={handleApplyFilters} className="gap-2 text-s sm:text-sm">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="gap-2 bg-transparent text-s sm:text-sm">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                Limpiar Todo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts mejorados - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <Card className="lg:col-span-3">
          <CardHeader className="px-4 sm:px-8 py-4 sm:py-6">
            <CardTitle className="text-base sm:text-xl">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Distribución por Tipo de Novedad
            </CardTitle>
            <CardDescription className="text-s sm:text-sm">
              Análisis detallado de la frecuencia de cada tipo de novedad registrada en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-8 py-4 sm:py-6">
            {loading ? (
              <div className="flex items-center justify-center h-64 sm:h-96">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">Cargando datos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 sm:h-96">
                <div className="text-center space-y-4">
                  <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-red-600 mb-2">Error al Cargar Datos</h3>
                    <p className="text-red-500 font-medium text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              </div>
            ) : typeCounts.length === 0 ? (
              <div className="flex items-center justify-center h-64 sm:h-96">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2">Sin Datos Disponibles</h3>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">No se encontraron novedades con los filtros actuales</p>
                  </div>
                </div>
              </div>
            ) : (
              <NoveltyTypeBarChart typeCounts={typeCounts} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="px-4 sm:px-8 py-4 sm:py-6">
            <CardTitle className="text-base sm:text-xl">
              <PieChartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Estado de las Novedades
            </CardTitle>
            <CardDescription className="text-s sm:text-sm">
              Visualización de la distribución actual de estados en el sistema filtrado.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-8 py-4 sm:py-6">
            {loading ? (
              <div className="flex items-center justify-center h-64 sm:h-80">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">Cargando estados...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 sm:h-80">
                <div className="text-center space-y-4">
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto" />
                  <p className="text-red-500 font-medium text-sm sm:text-base">Error al cargar</p>
                </div>
              </div>
            ) : statusCounts.length === 0 ? (
              <div className="flex items-center justify-center h-64 sm:h-80">
                <div className="text-center space-y-4">
                  <PieChartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-600 mb-2">Sin Estados</h3>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">No hay datos de estado disponibles</p>
                  </div>
                </div>
              </div>
            ) : (
              <NoveltyStatusPieChart />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Resumen de Filtros Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {noveltyType && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-700">Tipo:</span>
                  <span className="text-blue-600 font-medium">{noveltyType}</span>
                </div>
              )}
              {status && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700">Estado:</span>
                  <span className="text-green-600 font-medium">{status}</span>
                </div>
              )}
              {(dateRange.from || dateRange.to) && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold text-purple-700">Período:</span>
                  <span className="text-purple-600 font-medium">
                    {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                  </span>
                </div>
              )}
              {!noveltyType && !status && !dateRange.from && !dateRange.to && (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hay filtros activos</p>
                  <p className="text-gray-400 text-sm">Mostrando todos los datos disponibles</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="w-6 h-6 text-orange-600" />
              Métricas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <span className="font-semibold text-blue-700">Novedades Totales</span>
                <span className="text-2xl font-bold text-blue-600">{totalNovelties}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <span className="font-semibold text-green-700">Estados Únicos</span>
                <span className="text-2xl font-bold text-green-600">{statusCounts.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <span className="font-semibold text-purple-700">Tipos Únicos</span>
                <span className="text-2xl font-bold text-purple-600">{typeCounts.length}</span>
              </div>
              {statusCounts.length > 0 && (
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <span className="font-semibold text-orange-700">Más Común</span>
                  <span className="text-lg font-bold text-orange-600">
                    {statusCounts.reduce((prev, current) => (prev.value > current.value ? prev : current)).name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500 font-medium">
          Panel de Reportes • Última actualización: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}