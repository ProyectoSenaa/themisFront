import React, { useMemo, useState } from "react"
import { useQuery } from '@apollo/client'
import { ALL_NOVELTIES } from '@/graphqlServices/queries'
import { Calendar, FileText, User, Target, Activity } from "lucide-react"

const columns = [
  { Header: "ID", accessor: "id" },
  { Header: "Fecha", accessor: "date" },
  { Header: "Estudiante", accessor: "studentName" },
  { Header: "Tipo Novedad", accessor: "noveltyType" },
  { Header: "Estado", accessor: "noveltyStatus" },
  { Header: "Acciones", accessor: "actions" }
]

export default function CasesTable({ setSelectedCase }: { setSelectedCase: (c: any) => void }) {
  const { data, loading, error } = useQuery(ALL_NOVELTIES, { variables: { page: 0, size: 20 } })
  const [filter, setFilter] = useState("")

  const cases = useMemo(() => {
    if (!data?.allNovelties?.data) return []
    return data.allNovelties.data.map((c: any) => ({
      id: c.id,
      date: c.date,
      studentName: c.student?.person ? `${c.student.person.name} ${c.student.person.lastname}` : "-",
      noveltyType: c.noveltyType?.nameNovelty || "-",
      noveltyStatus: c.noveltyStatus?.name || "-",
      processFlowStatus: c.processFlowStatus?.name || "-",
      teacherId: c.teacher?.id || "-",
      actions: <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => setSelectedCase(c)}>Ver Detalles</button>
    }))
  }, [data])

  const filteredCases = cases.filter((c: any) =>
    c.studentName.toLowerCase().includes(filter.toLowerCase()) ||
    c.noveltyType.toLowerCase().includes(filter.toLowerCase()) ||
    c.noveltyStatus.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Filtrar por estudiante, tipo o estado..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 border rounded w-1/3"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Cargando casos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error al cargar casos</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.accessor} className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">{col.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((row: any) => (
              <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                {columns.map(col => (
                  <td key={col.accessor} className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{row[col.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
