"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  TextField, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import { FiX, FiSearch, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId, fetchNovelties } from "../../redux/features/noveltySlice";
import { 
  fetchStudentList, 
  addStudent, 
  setSelectedStudent,
  type Student 
} from "../../redux/features/studentSlice";
import IColumnProps from "../interfaces/components_interfaces/Table/IColumnProps";
import { toggleDarkMode } from "@/redux/features/themeSlice";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { enrichNoveltiesWithStudent } from '../service/enrichNovelties';
import FormSelectWithSearch from "./formSelectWithSearch";

interface TableProps {
  columns: IColumnProps[];
  data?: any[];
  onSave?: (formData: any) => void;
}

interface StudentFormData {
  studentId: string;
  name: string;
  role: string;
  status: string;
}

const Table: React.FC<TableProps> = ({ columns, data, onSave }) => {
  console.log(data);
  const dispatch = useAppDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const reduxNovelties = useSelector((state: RootState) => state.selectedNovelty.novelties);
  const loading = useSelector((state: RootState) => state.selectedNovelty.loading);
  const students = useSelector((state: RootState) => state.student.students);
  const studentsLoading = useSelector((state: RootState) => state.student.loading);
  const novelties = data ?? reduxNovelties;
  
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudentLocal] = useState<{ id: string | number; name: string; value?: string | number; label?: string } | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Cargar lista de estudiantes al montar el componente
  useEffect(() => {
    dispatch(fetchStudentList());
  }, [dispatch]);

  // Memorizar enrichedData para evitar recálculos innecesarios
  const enrichedData = React.useMemo(() => {
    return enrichNoveltiesWithStudent(novelties, students);
  }, [novelties, students]);

  useEffect(() => {
    setFilteredData(enrichedData);
  }, [enrichedData]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSearch = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const filtered = enrichedData.filter((row: any) =>
      columns.some((column) =>
        String(row[column.title] ?? "").toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  }, [enrichedData, columns]);

  const handleClearSearch = React.useCallback(() => {
    setSearchText("");
    setFilteredData(enrichedData);
  }, [enrichedData]);

  const handleSelect = React.useCallback((id: string) => {
    dispatch(setSelectedId(id));
  }, [dispatch]);

  const handleOpenModal = React.useCallback(() => {
    setIsModalOpen(true);
    setSelectedStudentLocal(null);
    setSelectedRole("");
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedStudentLocal(null);
    setSelectedRole("");
  }, []);

  const handleStudentSelect = React.useCallback((newValue: any) => {
    if (newValue) {
      const student = students.find(s => String(s.id) === String(newValue.id));
      if (student) {
        setSelectedStudentLocal({
          id: student.id,
          name: student.person?.name || "Unknown",
          value: student.id,
          label: student.person?.name || "Unknown",
        });
      }
    } else {
      setSelectedStudentLocal(null);
    }
  }, [students]);

  const handleAssignRole = async () => {
    if (!selectedStudent || !selectedRole) return;

    setIsAssigning(true);
    
    try {
      const student = students.find(s => String(s.id) === String(selectedStudent.id));
      if (!student) {
        throw new Error("Estudiante no encontrado");
      }

      const formData: StudentFormData = {
        studentId: student.id,
        name: student.person?.name || "Unknown",
        role: "Aprendiz",
        status: selectedRole
      };

      // Si hay una función onSave, la llamamos
      if (onSave) {
        await onSave(formData);
      }

      // Actualizar el estado del estudiante seleccionado en Redux
      dispatch(setSelectedStudent(student));

      // Cerrar modal y limpiar estado
      handleCloseModal();
      
      // Opcional: Mostrar mensaje de éxito
      console.log("Estudiante asignado exitosamente:", formData);
      
    } catch (error) {
      console.error("Error al asignar estudiante:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  // Función para obtener estudiantes con filtro y paginación
  const fetchStudentsForSelect = async ({ name, page, size }: { name: string; page: number; size: number }) => {
    const filtered = students.filter((student) =>
      student.person?.name?.toLowerCase().includes(name.toLowerCase()) ||
      student.person?.document?.toLowerCase().includes(name.toLowerCase())
    );

    const paginated = filtered.slice(page * size, page * size + size);

    return paginated.map(student => ({
      id: student.id,
      name: `${student.person?.name || "Nombre no disponible"} ${
        student.person?.document ? `(${student.person.document})` : ''
      }`,
    }));
  };

  return (
    <div className="w-full p-4 font-inter">
      {/* Search Bar y Botón Agregar Estudiante */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="max-w-md relative group">
          <div
            className={`absolute inset-0 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 -z-10
            bg-gradient-to-r ${
              darkMode
                ? "from-[#00304D] to-[#005386]"
                : "from-[#398f0d] to-lime-500"
            }`}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-md border border-gray-200">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar..."
              value={searchText}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <IconButton edge="start" size="small">
                    <FiSearch className="text-gray-500" />
                  </IconButton>
                ),
                endAdornment: searchText && (
                  <IconButton edge="end" size="small" onClick={handleClearSearch}>
                    <FiX className="text-gray-500" />
                  </IconButton>
                ),
                sx: {
                  borderRadius: '24px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '8px',
                },
              }}
            />
          </div>
        </div>

        {/* Botón Agregar Estudiante */}
        <Button
          variant="contained"
          startIcon={<FiUserPlus />}
          onClick={handleOpenModal}
          sx={{
            background: darkMode 
              ? 'linear-gradient(45deg, #00304D 30%, #005386 90%)'
              : 'linear-gradient(45deg, #398f0d 30%, #84cc16 90%)',
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 20px',
            '&:hover': {
              background: darkMode 
                ? 'linear-gradient(45deg, #004666 30%, #006ba3 90%)'
                : 'linear-gradient(45deg, #2d6b0a 30%, #65a30d 90%)',
            },
          }}
        >
          Agregar Estudiante
        </Button>
      </div>

      {/* Modal para Agregar Estudiante */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        className="backdrop-blur-sm"
        PaperProps={{
          className: "rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-white to-slate-50 border-0 p-0"
        }}
        BackdropProps={{
          className: "bg-black/60 backdrop-blur-sm"
        }}
      >
        {/* Header del Modal */}
        <div className={`relative px-8 py-6 text-white ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700' 
            : 'bg-gradient-to-br from-green-600 via-green-500 to-lime-500'
        }`}>
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <FiX size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <FiUserPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Agregar Estudiante
              </h2>
              <p className="text-sm opacity-90">
                Asignar rol de Aprendiz en el sistema Themis
              </p>
            </div>
          </div>
        </div>

        <DialogContent className="p-8 min-h-[300px]">
          {/* Indicador de pasos */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedStudent ? 'bg-emerald-500' : 'bg-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                selectedStudent ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                Seleccionar estudiante
              </span>
              
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ml-4 ${
                selectedStudent && selectedRole ? 'bg-emerald-500' : 'bg-gray-200'
              }`} />
              <span className={`text-sm font-medium ${
                selectedStudent && selectedRole ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                Configurar estado
              </span>
            </div>
            <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full bg-emerald-500 transition-all duration-300 ${
                selectedStudent ? (selectedRole ? 'w-full' : 'w-1/2') : 'w-0'
              }`} />
            </div>
          </div>

          {/* Formulario */}
          <div className="flex flex-col gap-6">
            {/* Selección de Estudiante */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Seleccionar Estudiante
              </h3>
              
              <FormControl fullWidth variant="outlined">
                <FormSelectWithSearch
                  value={selectedStudent ?? undefined}
                  onChange={handleStudentSelect}
                  placeholder="Buscar y seleccionar estudiante..."
                  fetchFn={fetchStudentsForSelect}
                  loading={studentsLoading}
                />
              </FormControl>
            </div>

            {/* Selección de Estado */}
            <div className={`transition-opacity duration-300 ${
              selectedStudent ? 'opacity-100' : 'opacity-50'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Estado del Estudiante
              </h3>
              
              <FormControl fullWidth variant="outlined" disabled={!selectedStudent}>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  displayEmpty
                  className={`rounded-xl ${
                    selectedStudent ? 'bg-slate-50' : 'bg-gray-100'
                  } ${
                    selectedRole 
                      ? 'border-2 border-emerald-500' 
                      : 'border border-gray-300'
                  } focus:border-emerald-500 transition-all`}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span className="text-gray-500">
                          Seleccionar estado...
                        </span>
                      );
                    }
                    return (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{selected}</span>
                      </div>
                    );
                  }}
                >
                  <MenuItem value="Activo" className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-medium">Activo</div>
                        <div className="text-xs text-gray-500">
                          El estudiante puede acceder al sistema
                        </div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Inactivo" className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <div className="font-medium">Inactivo</div>
                        <div className="text-xs text-gray-500">
                          El estudiante no puede acceder al sistema
                        </div>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem value="Pendiente" className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div>
                        <div className="font-medium">Pendiente</div>
                        <div className="text-xs text-gray-500">
                          Esperando confirmación para acceder
                        </div>
                      </div>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Información adicional */}
            {selectedStudent && selectedRole && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                  Resumen de la asignación:
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    • <strong>Estudiante:</strong> {selectedStudent.name}
                  </p>
                  <p>
                    • <strong>Rol:</strong> Aprendiz
                  </p>
                  <p>
                    • <strong>Sistema:</strong> Themis
                  </p>
                  <p>
                    • <strong>Estado:</strong> {selectedRole}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            padding: '24px 32px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            gap: 2,
          }}
        >
          <Button 
            onClick={handleCloseModal}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#d1d5db',
              color: '#6b7280',
              padding: '12px 24px',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssignRole}
            variant="contained"
            size="large"
            disabled={!selectedStudent || !selectedRole || isAssigning}
            startIcon={isAssigning ? <CircularProgress size={20} color="inherit" /> : <FiUserPlus />}
            sx={{
              background: !selectedStudent || !selectedRole 
                ? '#e5e7eb'
                : darkMode 
                  ? 'linear-gradient(135deg, #00304D 0%, #005386 100%)'
                  : 'linear-gradient(135deg, #398f0d 0%, #84cc16 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              minWidth: '160px',
              padding: '12px 24px',
              boxShadow: !selectedStudent || !selectedRole 
                ? 'none'
                : '0 4px 14px 0 rgba(57, 143, 13, 0.39)',
              '&:hover': {
                background: !selectedStudent || !selectedRole
                  ? '#e5e7eb'
                  : darkMode 
                    ? 'linear-gradient(135deg, #004666 0%, #006ba3 100%)'
                    : 'linear-gradient(135deg, #2d6b0a 0%, #65a30d 100%)',
                boxShadow: !selectedStudent || !selectedRole
                  ? 'none'
                  : '0 6px 20px 0 rgba(57, 143, 13, 0.5)',
              },
              '&:disabled': {
                background: '#e5e7eb',
                color: '#9ca3af',
              },
            }}
          >
            {isAssigning ? 'Asignando...' : 'Asignar Estudiante'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabla con estilo mejorado */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="overflow-x-auto">
          {!isMobile ? (
            <table className="min-w-full border dark:bg-gray-800 dark:border-gray-700">
              <thead>
                <tr
                  className={`bg-gradient-to-r ${
                    darkMode
                      ? "from-[#00304D] to-[#005386]"
                      : "from-[#398f0d] to-lime-500"
                  } text-white`}
                >
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-sm font-bold tracking-wider uppercase text-center"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-gray-100 transition-colors duration-200 text-center"
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 text-sm text-gray-700 whitespace-normal break-words"
                        >
                          {column.title === "name"
                            ? row.person?.name || "N/A"
                            : column.title === "lastname"
                            ? row.person?.lastname || "N/A"
                            : column.title === "email"
                            ? row.person?.email || "N/A"
                            : column.title === "document"
                            ? row.person?.document || "N/A"
                            : column.title === "state"
                            ? row.state
                              ? "Activo"
                              : "Inactivo"
                            : column.title === "studySheet"
                            ? row.studySheets?.[0]?.number || "N/A"
                            : row[column.title]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-10 text-center text-gray-500 italic"
                    >
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Mobile: render rows as stacked cards with label/value pairs
            <div className="space-y-4">
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <div key={rowIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">{row.person?.name || row.name || 'N/A'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className="break-words">
                          <div className="text-xs text-gray-400 mb-1 uppercase font-medium">{column.header}</div>
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-100">
                            {column.title === "name"
                              ? row.person?.name || "N/A"
                              : column.title === "lastname"
                              ? row.person?.lastname || "N/A"
                              : column.title === "email"
                              ? row.person?.email || "N/A"
                              : column.title === "document"
                              ? row.person?.document || "N/A"
                              : column.title === "state"
                              ? row.state
                                ? "Activo"
                                : "Inactivo"
                              : column.title === "studySheet"
                              ? row.studySheets?.[0]?.number || "N/A"
                              : row[column.title]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 italic">No se encontraron resultados</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;