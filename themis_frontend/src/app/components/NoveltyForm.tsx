import React, { useState, useRef, useEffect } from "react";
import { FaInfoCircle, FaArrowLeft, FaCheck, FaTimes, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Alert from "./Alert";
import IFormValues from "../interfaces/components_interfaces/NoveltyForm/IFormValues";
import { useRouter } from "next/navigation";
import { addNovelty } from "@/redux/features/noveltySlice";
import { fetchStudents, fetchStudentList, setSelectedStudent } from '@/redux/features/studentSlice';
import AsyncSelect from 'react-select/async';
import AuthService from "@/app/service/AuthService";


const NoveltyForm: React.FC<{ noveltyType: string }> = ({ noveltyType }) => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mensajeTipo, setMensajeTipo] = useState<"success" | "error" | "info" | "warning">("info");
  const [formValues, setFormValues] = useState<IFormValues>({
    noveltyType: { id: 1 }, // Por defecto, tipo de novedad 1
    apprendiceName: "",
    documentNumber: "",
    program: "",
    numberSheet: "",
    fundaments: "",
    documents: []
  });
  const [errors, setErrors] = useState({
    documents: "",
    fundaments: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  // Obtener datos del slice de noveltieType
  const noveltieType = useAppSelector(state => state.noveltieType.selectedNovelty);
  // Obtener aprendiz seleccionado del slice de estudiante
  const selectedStudent = useAppSelector(state => state.student.selectedStudent);
  const students = useAppSelector(state => state.student.students);
  const studentLoading = useAppSelector(state => state.student.loading);

  const dispatch = useAppDispatch();


  useEffect(() => {
    const user = AuthService.getUser();
    if (user && user.fk_id_person && user.fk_id_person.id) {
      setLoggedInUserId(user.fk_id_person.id);
    }

    if (!noveltieType || !noveltieType.id) {
      setMensaje("Tipo de novedad no disponible");
      setMensajeTipo("error");
      return;
    }

    // Solo mostrar advertencia de "seleccionar aprendiz" si NO es un aprendiz
    // Para aprendices, esperamos a que se carguen sus datos automáticamente
    const role = AuthService.getUserRole();
    const isApprentice = role === 'aprendiz' || role === 'student' || role === 'apprentice';

    if (!selectedStudent && !isApprentice) {
      setMensaje("Debe seleccionar un aprendiz");
      setMensajeTipo("warning");
      return;
    }

    // Si hay un estudiante seleccionado, limpiar mensaje y llenar formulario
    if (selectedStudent) {
      setMensaje(null);
      setFormValues({
        noveltyType: { id: noveltieType?.id ? Number(noveltieType.id) : 1 }, // siempre objeto con id
        apprendiceName: selectedStudent.person?.name || "",
        documentNumber: selectedStudent.person?.document || "",
        program: selectedStudent.studentStudySheets?.[0]?.studySheet?.trainingProject?.program?.name || "",
        numberSheet: selectedStudent.studentStudySheets?.[0]?.studySheet?.number || "",
        fundaments: "",
        documents: [],
      });

      console.log("✅ [NoveltyForm] Form populated with student data:", selectedStudent);
    }

  }, [noveltieType, selectedStudent]);


  useEffect(() => {
    // GraphQL query expects a `name` variable — map the document search to `name` so the backend receives it.
    // Solo hacer fetch si NO es aprendiz, o si es aprendiz pero aún no tenemos sus datos cargados
    const role = AuthService.getUserRole();
    const isApprentice = role === 'aprendiz' || role === 'student' || role === 'apprentice';

    if (!isApprentice) {
      dispatch(fetchStudents({ name: studentSearch, page: 0, size: 10 }));
    }
  }, [studentSearch, dispatch]);

  // Nuevo useEffect para cargar datos del aprendiz logueado
  useEffect(() => {
    const role = AuthService.getUserRole();
    const user = AuthService.getUser();

    console.log("=".repeat(60));
    console.log("🔍 [NoveltyForm] === APPRENTICE AUTO-FILL CHECK ===");
    console.log("🔍 [NoveltyForm] Raw Role from AuthService:", role);
    console.log("🔍 [NoveltyForm] Full User Object:", user);

    // Verificar múltiples variantes del rol de aprendiz
    const isApprentice = role?.toLowerCase().includes('aprendiz') ||
      role?.toLowerCase().includes('student') ||
      role?.toLowerCase().includes('apprentice');

    console.log("🔍 [NoveltyForm] Is Apprentice (computed):", isApprentice);

    // Soportar ambos formatos: fk_id_person (datos locales) y person (Cerberos)
    const personData = user?.fk_id_person || user?.person;

    console.log("🔍 [NoveltyForm] Person Data extracted:", personData);
    console.log("🔍 [NoveltyForm] user.fk_id_person:", user?.fk_id_person);
    console.log("🔍 [NoveltyForm] user.person:", user?.person);

    // IMPORTANTE: Cerberos NO incluye el campo 'document' en person
    // Por eso buscamos por nombre completo en lugar de documento
    const searchName = personData?.name || "";
    const searchLastname = personData?.lastname || "";

    console.log("🔍 [NoveltyForm] Search Name:", searchName);
    console.log("🔍 [NoveltyForm] Search Lastname:", searchLastname);

    // Verificar cada condición individualmente
    console.log("🔍 [NoveltyForm] Condition checks:");
    console.log("   - isApprentice:", isApprentice);
    console.log("   - user exists:", !!user);
    console.log("   - personData exists:", !!personData);
    console.log("   - searchName exists:", !!searchName);

    if (isApprentice && user && personData && searchName) {
      console.log("✅ [NoveltyForm] ALL CONDITIONS MET - Starting fetch for name:", searchName, searchLastname);

      // Si es aprendiz, buscamos sus datos de estudiante
      // IMPORTANTE: Usamos fetchStudentList porque necesitamos buscar por nombre
      const fetchApprenticeData = async () => {
        try {
          console.log("📡 [NoveltyForm] Fetching ALL students to find by name:", searchName);

          // Fetch all students (sin filtros)
          const response = await dispatch(fetchStudentList()).unwrap();

          console.log("📥 [NoveltyForm] Fetch response received");
          console.log("📥 [NoveltyForm] Total students fetched:", response?.length);

          if (response && response.length > 0) {
            console.log("📋 [NoveltyForm] All students in response:", response.map((s: any) => ({
              id: s.id,
              name: s.person?.name,
              lastname: s.person?.lastname,
              document: s.person?.document
            })));

            // Buscamos el estudiante que coincida con nombre Y apellido
            // Normalizamos: trim() para quitar espacios y toLowerCase() para comparación case-insensitive
            const normalizedSearchName = searchName.trim().toLowerCase();
            const normalizedSearchLastname = searchLastname.trim().toLowerCase();

            const myStudent = response.find((s: any) => {
              const studentName = (s.person?.name || "").trim().toLowerCase();
              const studentLastname = (s.person?.lastname || "").trim().toLowerCase();

              console.log(`🔍 Comparing: "${normalizedSearchName}" === "${studentName}" && "${normalizedSearchLastname}" === "${studentLastname}"`);

              return studentName === normalizedSearchName && studentLastname === normalizedSearchLastname;
            });

            console.log("🎯 [NoveltyForm] Matching student found:", myStudent);

            if (myStudent) {
              console.log("✅ [NoveltyForm] Setting selected student:", myStudent);
              dispatch(setSelectedStudent(myStudent));
            } else {
              console.warn("⚠️ [NoveltyForm] Student not found matching name:", searchName, searchLastname);
              console.warn("⚠️ [NoveltyForm] Available names:", response.map((s: any) => `${s.person?.name} ${s.person?.lastname}`));
            }
          } else {
            console.warn("⚠️ [NoveltyForm] No students returned from fetch");
            console.warn("⚠️ [NoveltyForm] Full response:", response);
          }
        } catch (error) {
          console.error("❌ [NoveltyForm] Error fetching apprentice data:", error);
          console.error("❌ [NoveltyForm] Error details:", JSON.stringify(error, null, 2));
        }
      };

      fetchApprenticeData();
    } else {
      console.log("❌ [NoveltyForm] Skipping pre-fill - Conditions not met:");
      console.log("   - isApprentice:", isApprentice);
      console.log("   - user exists:", !!user);
      console.log("   - personData exists:", !!personData);
      console.log("   - searchName exists:", !!searchName);
      console.log("=".repeat(60));
    }
  }, [dispatch]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === 'fundaments' && errors.fundaments) {
      setErrors({ ...errors, fundaments: "" });
    }
  };

  const handleDocumentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newDocuments = Array.from(files).slice(0, 1);
      setFormValues({ ...formValues, documents: newDocuments });
      setErrors({ ...errors, documents: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {
      documents: "",
      fundaments: ""
    };
    let isValid = true;
    if (formValues.documents.length === 0) {
      newErrors.documents = "Debe adjuntar al menos un archivo";
      isValid = false;
    } else if (formValues.documents.length > 1) {
      newErrors.documents = "¡Solo puede subir un archivo!";
      isValid = false;
    }
    if (!formValues.fundaments.trim()) {
      newErrors.fundaments = "Los fundamentos son requeridos";
      isValid = false;
    } else if (formValues.fundaments.length < 10) {
      newErrors.fundaments = "Los fundamentos deben tener al menos 10 caracteres";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1].replace(/\s/g, '');
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const fecha = new Date();
      const mensajeAviso = `Tu novedad fue registrada el día ${fecha.toLocaleDateString("es-ES")} a las ${fecha.toLocaleTimeString("es-ES")}.`;
      // determine role and map to the correct id field expected by backend
      const user = AuthService.getUser();
      const roleRaw = AuthService.getUserRole();
      const role = roleRaw ? String(roleRaw).toLowerCase() : "";

      const studentId = selectedStudent?.id ? Number(selectedStudent.id) : null;
      const personId = user?.fk_id_person?.id ? Number(user.fk_id_person.id) : loggedInUserId;

      const roleFields: any = {};
      if (role.includes('student') || role.includes('aprendiz') || role.includes('apprentice')) {
        if (studentId) roleFields.studentId = studentId;
      } else if (role.includes('teacher') || role.includes('instructor')) {
        if (personId) roleFields.teacherId = personId;
      } else if (role.includes('administrative') || role.includes('admin') || role.includes('coordinator')) {
        if (personId) roleFields.administrativeId = personId;
      } else {
        // default: send studentId if available
        if (studentId) roleFields.studentId = studentId;
      }


      const newNovelty: any = {

        date: fecha.toISOString().split('T')[0],
        observation: formValues.fundaments,

        justification: formValues.fundaments,
        isActive: true,
        noveltyType: { id: noveltieType.id },

        noveltyStatus: { id: 1 },
        noveltyFiles: formValues.documents.length > 0
          ? await toBase64(formValues.documents[0])
          : "",

        studentId: studentId ?? undefined,

        ...roleFields,
      };
      // Log the exact variables that will be sent to GraphQL for quick inspection in Network/Console
      console.log('Novelty mutation input:', newNovelty);
      const resultAction = await dispatch(addNovelty(newNovelty));
      if (addNovelty.fulfilled.match(resultAction)) {
        setMensaje(mensajeAviso);
        setMensajeTipo("success");
        setTimeout(() => {
          router.push("/routes/novelties");
        }, 1000);
      } else {
        setMensaje((resultAction.payload as any)?.message || "Ocurrió un error al registrar la novedad. Inténtalo de nuevo.");
        setMensajeTipo("error");
      }
    } catch (error) {
      setMensaje("Ocurrió un error al registrar la novedad. Inténtalo de nuevo.");
      setMensajeTipo("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      fundaments: "",
      documents: []
    }));
    setErrors({
      documents: "",
      fundaments: ""
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderFieldLabel = (label: string, required: boolean = false) => (
    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const renderDisabledField = (id: string, value: string, rows: number = 1) => (
    <div className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg p-3 text-gray-600 dark:text-gray-200 shadow-inner">
      {rows > 1 ? (
        <div className="min-h-16 whitespace-pre-wrap">{value}</div>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-slate-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-200">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-screen dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="mr-4 p-2 rounded-full bg-white dark:bg-slate-700 shadow-md text-darkGreen dark:text-green-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all"
              aria-label="Volver"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
              {noveltyType}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 border border-b-transparent border-t-transparent border-r-transparent border-l-4 border-l-darkGreen dark:border-l-[#005386] rounded-xl shadow-lg overflow-hidden"
          >
            {/* Form content */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left section - 2/3 width */}
                <div className="md:col-span-2 space-y-6">
                  {/* Primera fila: Aprendiz y Documento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Aprendiz (autocomplete con react-select) */}
                    <div>
                      {renderFieldLabel("Aprendiz", true)}
                      {/* Si es aprendiz, mostramos el nombre en un campo deshabilitado. Si no, mostramos el select */}
                      {AuthService.getUserRole() === 'aprendiz' || AuthService.getUserRole() === 'student' || AuthService.getUserRole() === 'apprentice' ? (
                        renderDisabledField("apprendiceName", formValues.apprendiceName)
                      ) : (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={students.map(s => ({
                            value: s.id,
                            label: `${s.person?.name} (${s.person?.document})`,
                            student: s
                          }))}
                          // Use the document number as the search field. onInputChange updates studentSearch
                          onInputChange={(newValue) => { setStudentSearch(newValue || ''); return newValue; }}
                          loadOptions={async (inputValue) => {
                            // Filtra por número de documento (document)
                            const filtered = students.filter(s =>
                              s.person?.document?.toString().includes((inputValue || '').toString())
                            );
                            return filtered.map(s => ({
                              value: s.id,
                              label: `${s.person?.name} (${s.person?.document})`,
                              student: s
                            }));
                          }}
                          isLoading={studentLoading}
                          value={selectedStudent ? {
                            value: selectedStudent.id,
                            label: `${selectedStudent.person?.name} (${selectedStudent.person?.document})`,
                            student: selectedStudent
                          } : null}
                          onChange={option => {
                            if (option && option.student) {
                              dispatch(setSelectedStudent(option.student));
                            } else {
                              dispatch(setSelectedStudent(null));
                            }
                          }}
                          placeholder="Buscar por número de documento..."
                          noOptionsMessage={() => studentLoading ? 'Cargando...' : 'No se encontraron aprendices'}
                          styles={{
                            control: (base, state) => ({ ...base, minHeight: 48, borderColor: state.isFocused ? '#005386' : '#d1d5db', boxShadow: 'none', backgroundColor: state.isFocused ? '#e5f4ed' : '#fff' }),
                            option: (base, state) => ({ ...base, color: state.isFocused ? '#005386' : '#222', backgroundColor: state.isFocused ? '#e5f4ed' : '#fff' }),
                            menu: (base) => ({ ...base, backgroundColor: '#fff' }),
                          }}
                          classNamePrefix="react-select"
                        />
                      )}
                    </div>
                    {/* Documento */}
                    <div>
                      {renderFieldLabel("Documento")}
                      {renderDisabledField("documentNumber", formValues.documentNumber)}
                    </div>
                  </div>
                  {/* Segunda fila: Programa y Ficha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Programa */}
                    <div>
                      {renderFieldLabel("Programa")}
                      {renderDisabledField("program", formValues.program, 2)}
                    </div>
                    {/* Ficha */}
                    <div>
                      {renderFieldLabel("Ficha")}
                      {renderDisabledField("numberSheet", formValues.numberSheet)}
                    </div>
                  </div>
                  {/* Tercera fila: Fundamentos (ancho completo con más espacio) */}
                  <div>
                    {renderFieldLabel("Fundamentos", true)}
                    <textarea
                      id="fundaments"
                      name="fundaments"
                      value={formValues.fundaments}
                      onChange={handleChange}
                      className={`w-full border ${errors.fundaments ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent transition-all resize-none shadow-sm dark:bg-slate-700 dark:text-gray-200`}
                      rows={6}
                      placeholder="Ingrese los fundamentos de la novedad..."
                    />
                    {errors.fundaments && (
                      <p className="mt-1 text-red-500 text-sm flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.fundaments}
                      </p>
                    )}
                  </div>
                </div>
                {/* Right section - 1/3 width */}
                <div className="md:col-span-1">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600 h-full">
                    {renderFieldLabel("Documentos adjuntos", true)}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-600 mb-4">
                      <div className="flex items-start mb-3">
                        <FaInfoCircle className="text-blue-600 dark:text-blue-400 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Archivos Necesarios:</h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
                            <li>Constancia de Novedad registrada en Sofia Plus</li>
                            <li>Firma del Aprendiz</li>
                            <li>Documentos que sustenten la novedad (en caso de que sea necesarios)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 text-sm mb-4">
                        <strong>Importante:</strong> Recuerde adjuntar estos archivos en UN (1) solo PDF.
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="documents"
                        name="documents"
                        accept=".pdf"
                        onChange={handleDocumentsChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`flex items-center justify-center border-2 border-dashed ${errors.documents ? 'border-red-400 bg-red-50 dark:bg-red-900' : 'border-darkGreen bg-green-50 dark:bg-blue-950 dark:border-white'} rounded-lg p-6 text-center`}>
                        <div>
                          <FaFileAlt className="mx-auto text-3xl mb-2 text-darkGreen dark:text-white" />
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            {formValues.documents.length > 0
                              ? formValues.documents[0].name
                              : "Arrastrar archivo o hacer clic para seleccionar"}
                          </p>
                          <p className="text-s text-gray-500 dark:text-gray-400 mt-1">Solo archivos PDF</p>
                        </div>
                      </div>
                    </div>
                    {errors.documents && (
                      <p className="mt-2 text-red-500 text-sm flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.documents}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Form actions */}
            <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 flex justify-end space-x-4 border-t border-gray-200/20 dark:border-slate-600">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-lg flex items-center justify-center bg-darkGreen hover:bg-hoverGreen text-white transition-colors shadow-md dark:bg-blue-900 dark:hover:bg-slate-800 dark:text-white ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Registrar
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Alert message */}
          {mensaje && (
            <div className="mt-6">
              <Alert message={mensaje} type={mensajeTipo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoveltyForm;