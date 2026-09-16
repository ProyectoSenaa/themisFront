'use client'

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addStudent, fetchStudents, setSelectedStudent, Student, fetchStudentList } from "@/redux/features/studentSlice";
import FilterInfo from "./components/FilterInfo";
import NoResults from "./components/NoResults";
import UserTable from "./components/UserTable";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, FormControl, CircularProgress, IconButton } from "@mui/material";
import { FiUserPlus, FiX } from "react-icons/fi";
import FormSelectWithSearch from "@/app/components/formSelectWithSearch";

export default function RolUser() {
  const selectedStudent = useAppSelector((state) => state.student.selectedStudent);
  const students = useAppSelector((state) => state.student.students);
  const studentsLoading = useAppSelector((state) => state.student.loading);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentModal, setSelectedStudentModal] = useState<{ id: string | number; name: string; value?: string | number; label?: string } | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchStudents({ name: searchQuery, page: 0, size: 10 }));
    dispatch(fetchStudentList());
  }, [dispatch, searchQuery]);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudentModal(null);
    setSelectedRole("");
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilterOption("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!selectedStudentModal || !selectedRole) return;

    setIsAssigning(true);

    try {
      const student = students.find(s => String(s.id) === String(selectedStudentModal.id));
      if (!student) {
        throw new Error("Estudiante no encontrado");
      }

      await dispatch(addStudent({ student })).unwrap();
      dispatch(setSelectedStudent(student));
      handleCloseModal();
    } catch (error) {
      console.error("Error al asignar estudiante:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(event.target.value);
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (filterOption) {
      setSearchQuery(event.target.value);
    }
  };

  const handleSubmit = () => {
    console.log('Buscando:', searchQuery, 'en campo:', filterOption);
  };

  const handleStudentSelect = (newValue: any) => {
    if (newValue) {
      const student = students.find(s => String(s.id) === String(newValue.id));
      if (student) {
        setSelectedStudentModal({
          id: student.id,
          name: student.person?.name || "Unknown",
          value: student.id,
          label: student.person?.name || "Unknown",
        });
      }
    } else {
      setSelectedStudentModal(null);
    }
  };

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

  const columns = [
    { header: "ID", key: "id" },
    { header: "Nombre", key: "name", render: (row: Student) => row.person.name },
    { header: "Apellido", key: "lastname", render: (row: Student) => row.person.lastname },
    { header: "Correo", key: "email", render: (row: Student) => row.person.email },
    { header: "Documento", key: "document", render: (row: Student) => row.person.document },
    { header: "Estado", key: "state", render: (row: Student) => row.state ? "Activo" : "Inactivo" },
    { header: "Ficha", key: "studySheet", render: (row: Student) => row.studentStudySheets?.[0]?.studySheet.number || "N/A" },
  ];

  const filteredData = useMemo(() => {
    if (!filterOption || !searchQuery.trim()) {
      return students;
    }
    const query = searchQuery.toLowerCase().trim();
    return students.filter(item => {
      switch (filterOption) {
        case "nombre":
          return item.person.name.toLowerCase().includes(query);
        case "apellido":
          return item.person.lastname.toLowerCase().includes(query);
        case "numFicha":
          return item.id.includes(query);
        case "programa":
          return item.studentStudySheets.some(sheet =>
            sheet.studySheet.trainingProject.program.name.toLowerCase().includes(query)
          );
        case "jornada":
          return false;
        default:
          return true;
      }
    });
  }, [searchQuery, filterOption, students]);

  const getPlaceholder = () => {
    if (!filterOption) return "Selecciona un filtro primero...";
    switch (filterOption) {
      case "nombre": return "Buscar por nombre...";
      case "apellido": return "Buscar por apellido...";
      case "numFicha": return "Buscar por número de ficha...";
      case "programa": return "Buscar por programa...";
      case "jornada": return "Buscar por jornada...";
      default: return "Buscar...";
    }
  };

  const darkMode = useAppSelector((state) => state.theme.darkMode);
  return (
    <div className={"flex flex-col items-center pt-20 sm:pt-6 min-h-screen " + (darkMode ? "bg-[#181f2a]" : "bg-white") }>
      <h1
        className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent text-center mt-5 mb-8"
      >
        Tabla de Usuarios
      </h1>

      <FilterInfo
        filterOption={filterOption}
        searchQuery={searchQuery}
        filteredDataLength={filteredData.length}
        totalDataLength={students.length}
      />

      {filterOption && searchQuery && filteredData.length === 0 && (
        <NoResults searchQuery={searchQuery} filterOption={filterOption} />
      )}

      <UserTable columns={columns} data={filteredData} onAddClick={handleAddClick} isDarkMode={darkMode} />

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Agregar Estudiante
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <FiX />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <FormSelectWithSearch
              value={selectedStudentModal ?? undefined}
              onChange={handleStudentSelect}
              placeholder="Buscar y seleccionar estudiante..."
              fetchFn={fetchStudentsForSelect}
              loading={studentsLoading}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Seleccionar estado...
              </MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!selectedStudentModal || !selectedRole || isAssigning}>
            {isAssigning ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
