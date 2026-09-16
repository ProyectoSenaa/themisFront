'use client';
import { GET_USER_BY_ID } from "@/app/graphqlServices/Cerveros_Login/authGraph"
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import '../styles/globals.css'
import UserService from '../service/UserService';
import { TbCameraPlus } from 'react-icons/tb';
import { IoMailOutline, IoPhonePortraitOutline, IoDocumentTextOutline, IoPersonOutline } from 'react-icons/io5';
import { FaRegUserCircle, FaCheck } from 'react-icons/fa';
import { RiUserSettingsLine } from 'react-icons/ri';
import { MdOutlineCancel } from 'react-icons/md';
import EdithPhoto from './EdithPhoto';
import IConfigProfileProps from '../interfaces/components_interfaces/ConfigProfile/IConfigrofile';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface FormValues {
    id: number,
    name: string;
    lastname: string;
    email: string;
    numberPhone: number;
    role: string;
    document: string;
    dateBirth: string;
    bloodType: string;
    address: string;
    documentType: string;
}

interface ComplaintFormProps {
    user: any;
    userData: any;
    userLoading: boolean;
    userError: any;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ user, userData, userLoading, userError }) => {
    const [formValues, setFormValues] = useState<FormValues>({
        id: 0,
        name: '',
        lastname: '',
        email: '',
        numberPhone: 0,
        role: '',
        document: '',
        dateBirth: '',
        bloodType: '',
        address: '',
        documentType: '',
    });

    const [errors, setErrors] = useState({
        numberPhone: "",
        email: "",
    });

    const [mensaje, setMensaje] = useState("");
    const REGX_email = /^[a-zA-Zñ_0-9\.]+\@(gmail|hotmail|outlook|sena)\.(com|co|es|edu)\.(co)$/;

    // Cargar datos desde GraphQL
    useEffect(() => {
        if (userData?.userById?.data) {
            const userDataResponse = userData.userById.data;
            const person = userDataResponse.person;

            setFormValues((prev) => ({
                ...prev,
                id: person.id || 0,
                name: person.name || '',
                lastname: person.lastname || '',
                email: person.email || '',
                numberPhone: person.phone || 0,
                document: person.document || '',
                dateBirth: person.dateBirth || '',
                bloodType: person.bloodType || '',
                address: person.address || '',
                documentType: person.documentType?.name || '',
            }));
        }
    }, [userData]);

    // Obtener rol desde Redux
    useEffect(() => {
        if (user) {
            const rolesString = user.roleList?.map((role: any) => role.name).join(', ') ||
                user.roles?.map((role: any) => role.name).join(', ') ||
                user.role ||
                'Usuario';

            setFormValues((prev) => ({
                ...prev,
                role: rolesString,
            }));
        }
    }, [user]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validateForm = () => {
        let newErrors = {
            numberPhone: "",
            email: "",
        };

        if (!formValues.numberPhone) {
            newErrors.numberPhone = "Por favor, completa el campo de número de celular.";
        } else if (formValues.numberPhone.toString().length !== 10) {
            newErrors.numberPhone = "El número de teléfono debe tener 10 dígitos.";
        } else if (!/^\d+$/.test(formValues.numberPhone.toString())) {
            newErrors.numberPhone = "El número de teléfono solo debe contener números.";
        }

        if (!formValues.email) {
            newErrors.email = "Por favor, completa el campo de correo electrónico.";
        } else if (!REGX_email.test(formValues.email)) {
            newErrors.email = "El correo electrónico debe ser en uno de los siguientes dominios: gmail, hotmail, outlook, sena.edu y terminar con .com, .co, .es.";
        }

        if (newErrors.numberPhone || newErrors.email) {
            return newErrors;
        }

        return null;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (validationErrors) {
            setErrors(validationErrors);
            setMensaje("");
        } else {
            const fecha = new Date();
            const fechaFormateada = fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
            const horaFormateada = fecha.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })

            const mensajeAviso = `Tu perfil fue actualizado el día ${fechaFormateada} a las ${horaFormateada}`;

            setMensaje(mensajeAviso);
            setErrors({ numberPhone: "", email: "" });

            setTimeout(() => {
                setMensaje("");
            }, 3000);

            console.log("Form data: ", formValues);
        }
    };

    if (userLoading) {
        return <div className="text-center py-8">Cargando datos...</div>;
    }

    if (userError) {
        return <div className="text-center py-8 text-red-600">Error al cargar los datos del usuario</div>;
    }

    return (
        <form onSubmit={handleSubmit} className='font-inter'>
            <div className="flex items-center mb-6 sm:mb-8 border-b border-gray-200 pb-3 sm:pb-4">
                <RiUserSettingsLine className="text-darkGreen text-xl sm:text-2xl mr-2 sm:mr-3" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Información de Perfil</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-5 md:gap-y-6">
                {/* Nombre */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <FaRegUserCircle />
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.name}
                        />
                    </div>
                </div>

                {/* Apellidos */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <FaRegUserCircle />
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.lastname}
                        />
                    </div>
                </div>

                {/* Correo */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <IoMailOutline />
                        </span>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.email}
                        />
                    </div>
                </div>

                {/* Número de Documento */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <IoDocumentTextOutline />
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.document}
                        />
                    </div>
                </div>

                {/* Rol */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <IoPersonOutline />
                        </span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.role}
                        />
                    </div>
                </div>

                {/* Teléfono */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <IoPhonePortraitOutline />
                        </span>
                        <input
                            type="text"
                            id="phone"
                            name="numberPhone"
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none cursor-not-allowed"
                            disabled
                            value={formValues.numberPhone}
                        />
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 sm:mt-10 border-t border-gray-200 pt-4 sm:pt-6">
                <button
                    type="reset"
                    className="flex items-center justify-center px-5 sm:px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-300 shadow-sm w-full sm:w-auto"
                >
                    <MdOutlineCancel className="mr-2" />
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center justify-center px-5 sm:px-6 py-2.5 bg-darkGreen hover:bg-hoverGreen text-white rounded-lg transition duration-300 shadow-sm w-full sm:w-auto"
                >
                    <FaCheck className="mr-2" />
                    Guardar
                </button>
            </div>

            {/* Mensaje de éxito */}
            {mensaje && (
                <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-md animate-fadeIn">
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg">
                        <div className="flex items-center mb-2">
                            <FaCheck className="text-green-500 mr-2" />
                            <p className="font-semibold text-sm sm:text-base">¡Información actualizada con éxito!</p>
                        </div>
                        <p className="text-xs sm:text-sm mb-3">{mensaje}</p>
                        <button
                            className="float-right px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300 text-xs sm:text-sm"
                            onClick={() => setMensaje("")}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

const ConfigProfile: React.FC<IConfigProfileProps> = ({ open, onClose }) => {

    const { user } = useSelector((state: RootState) => state.auth);
    const [profileImage, setProfileImage] = useState('/sena/image_user.png');
    const [userName, setUserName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // GraphQL Query
    const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_BY_ID, {
        variables: { id: user?.id },
        skip: !user?.id,
    });

    // Actualizar nombre y apellido cuando los datos de GraphQL cambien
    useEffect(() => {
        if (userData?.userById?.data?.person) {
            const person = userData.userById.data.person;
            setUserName(person.name || '');
            setUserLastName(person.lastname || '');
        }
    }, [userData]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto font-inter bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Cabecera */}
            <div className="relative h-40 sm:h-48 md:h-56 bg-gradient-to-r from-[#398f0d] to-lime-500 dark:from-[#00304D] dark:to-[#005386]">
                {/* Logo */}
                <div className="absolute right-3 top-3 sm:right-4 sm:top-4 md:right-6 md:top-6">
                    <Image
                        src="/img/LogoSenaBlanco.png"
                        alt="Logo del SENA"
                        width={80}
                        height={80}
                        className="opacity-90 hover:opacity-100 transition-opacity w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[120px] lg:h-[120px]"
                    />
                </div>

                {/* Información del usuario y foto */}
                <div className="absolute left-0 -bottom-12 sm:-bottom-14 md:-bottom-16 flex flex-col sm:flex-row items-center sm:items-end pl-4 sm:pl-6 md:pl-8 w-full pr-4 sm:pr-6 md:pr-8">
                    <div className="relative group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                            <Image
                                className="w-full h-full object-cover"
                                src={profileImage}
                                alt="Foto de Perfil"
                                title="Foto de Perfil"
                                width={150}
                                height={150}
                            />
                        </div>
                        <button
                            className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-darkGreen hover:bg-hoverGreen text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                            onClick={handleOpenModal}
                            title="Cambiar foto de perfil"
                        >
                            <TbCameraPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <EdithPhoto open={modalOpen} onClose={handleCloseModal} profileImage={profileImage} />
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 md:ml-6 mb-0 sm:mb-8 md:mb-10 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl sm:rounded-bl-3xl sm:rounded-tr-3xl px-3 py-2 sm:p-2 shadow-lg text-center sm:text-left">
                        <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md break-words">{userName} {userLastName}</p>
                    </div>
                </div>
            </div>

            {/* Contenido del formulario */}
            <div className="pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10 bg-white">
                <ComplaintForm user={user} userData={userData} userLoading={userLoading} userError={userError} />
            </div>
        </div>
    );
};

export default ConfigProfile;