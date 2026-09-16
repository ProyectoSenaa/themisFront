import React, { useState, useMemo } from 'react';
import NoveltyGrid from './NoveltyGrid';
import LoadingGrid from './LoadingGrid';
import { useNoveltyManagement } from './useNoveltyManagement';
import NoveltyModals from './NoveltyModals';
import INoveltyType from '../../../interfaces/components_interfaces/CardA_&_CardSA/INoveltyType';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addItemToUpdateIndex, addSelectedItem, isConfirmUpdateModalVisible, isModalVisible, isAddModalVisible } from '@/redux/features/ModalSlice';
import NoveltyForm from './NoveltyForm';
import { useNoveltyService } from './noveltyService';
import Alert from '@/app/components/Alert';
import { useRole } from '@/context/RoleContext';
import AuthService from '@/app/service/AuthService';

// Definir novedades permitidas para cada rol
const apprenticeAllowedNovelties = [
  'Aplazamiento',
  'Retiro Voluntario',
  'Reingreso',
  'Traslado'
];

const instructorAllowedNovelties = [
  'Deserción'
];

const NoveltyManagement: React.FC = () => {
  const { noveltyTypes, roles, loading, error } = useNoveltyManagement();
  const { userRole } = useRole();
  // read normalized role from AuthService (replaces selectedRole slice)
  const selectedRole = AuthService.getUserRole();
  const dispatch = useAppDispatch();
  
  // Obtener el modo oscuro desde Redux para re-render automático
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedNovelty, setSelectedNovelty] = useState<INoveltyType | null>(null);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' | '' }>({ message: '', type: '' });

  // Definir novedades permitidas para cada rol


  // Obtener el rol del usuario de múltiples fuentes
  const contextRole = userRole;
  const reduxRole = selectedRole;
  const authUser = AuthService.getUser();
  const authRole = authUser?.roleList?.[0]?.name;

  console.log('🔍 Context Role:', contextRole);
  console.log('🔍 Redux Role:', reduxRole);
  console.log('🔍 Auth User:', authUser);
  console.log('🔍 Auth Role:', authRole);

  // Usar cualquiera de los roles que esté disponible
  const currentUserRole = contextRole || reduxRole || authRole;

  // Filtrar novedades basado en el rol del usuario
  const filteredItems: INoveltyType[] = useMemo(() => {
    const allItems = Array.isArray(noveltyTypes)
      ? noveltyTypes.map((n: any) => ({ ...n, roles: n.roles || [] }))
      : [];

    console.log('�� All items:', allItems.map(item => item.nameNovelty));

    // Verificar si es aprendiz de múltiples maneras
    const isApprenticeRole = reduxRole === 'aprendiz' ||
      contextRole === 'APPRENTICE' ||
      authUser?.roleList?.some((role: any) =>
        role.name === 'APPRENTICE' ||
        role.name === 'APRENDIZ' ||
        role.name.toLowerCase().includes('aprendiz')
      );

    // Verificar si es instructor
    const isInstructorRole = reduxRole === 'instructor' ||
      contextRole === 'INSTRUCTOR' ||
      authUser?.roleList?.some((role: any) =>
        role.name === 'INSTRUCTOR' ||
        role.name.toLowerCase().includes('instructor')
      );

    console.log('🔍 Is apprentice role:', isApprenticeRole);
    console.log('🔍 Is instructor role:', isInstructorRole);

    // Si es aprendiz, filtrar solo las novedades permitidas para aprendices
    if (isApprenticeRole) {
      const filtered = allItems.filter(item => {
        const noveltyName = item.nameNovelty?.toLowerCase() || '';
        return apprenticeAllowedNovelties.some(allowedName => {
          const allowedLower = allowedName.toLowerCase();
          return noveltyName === allowedLower || noveltyName.includes(allowedLower);
        });
      });
      console.log('🔍 Filtered items for apprentice:', filtered.map(item => item.nameNovelty));
      return filtered;
    }

    // Si es instructor, filtrar solo las novedades permitidas para instructores
    if (isInstructorRole) {
      const filtered = allItems.filter(item => {
        const noveltyName = item.nameNovelty?.toLowerCase() || '';
        return instructorAllowedNovelties.some(allowedName => {
          const allowedLower = allowedName.toLowerCase();
          return noveltyName === allowedLower || noveltyName.includes(allowedLower);
        });
      });
      console.log('🔍 Filtered items for instructor:', filtered.map(item => item.nameNovelty));
      return filtered;
    }

    console.log('🔍 Returning all items (coordinator or admin role)');
    // Para otros roles (coordinador, admin), mostrar todas las novedades
    return allItems;
  }, [noveltyTypes, reduxRole, contextRole, authUser, apprenticeAllowedNovelties, instructorAllowedNovelties]);

  // Determinar si el usuario puede agregar nuevas novedades (solo coordinador y admin)
  const canAddNovelties = useMemo(() => {
    const isApprentice = reduxRole === 'aprendiz' ||
      contextRole === 'APPRENTICE' ||
      authUser?.roleList?.some((role: any) =>
        role.name === 'APPRENTICE' ||
        role.name === 'APRENDIZ' ||
        role.name.toLowerCase().includes('aprendiz')
      );

    const isInstructor = reduxRole === 'instructor' ||
      contextRole === 'INSTRUCTOR' ||
      authUser?.roleList?.some((role: any) =>
        role.name === 'INSTRUCTOR' ||
        role.name.toLowerCase().includes('instructor')
      );

    // Solo coordinadores y admins pueden agregar novedades
    const canAdd = !isApprentice && !isInstructor;
    console.log('🔍 Can add novelties:', canAdd);
    return canAdd;
  }, [reduxRole, contextRole, authUser]);

  const { addNovelty, updateNovelty, fetchNovelties } = useNoveltyService();


  // Estado de modales y novedad seleccionada

  // Handlers para acciones del grid
  const handleUpdateClick = (id: number) => {
    const currentItem = filteredItems.find(item => item.id === id) || null;
    setSelectedNovelty(currentItem);
    setConfirmOpen(true);
  };
  const handleInfoClick = (item: INoveltyType) => {
    setSelectedNovelty(item);
    setDetailsOpen(true);
  };
  const handleRegisterClick = (item: INoveltyType) => {
    // Implementa lógica de registro si aplica
  };
  const handleAddClick = () => {
    setFormInitialValues({});
    setAddOpen(true);
  };

  const handleAddSubmit = async (values: any) => {
    try {
      await addNovelty(values);
      setAddOpen(false);
      setAlert({ message: 'Tipo de novedad agregado exitosamente', type: 'success' });
      fetchNovelties();
    } catch (e) {
      setAlert({ message: 'Error al agregar novedad', type: 'error' });
    }
  };

  const handleAddCancel = () => setAddOpen(false);

  const handleConfirm = async () => {
    if (selectedNovelty) {
      try {
        await updateNovelty({
          id: selectedNovelty.id,
          input: { ...selectedNovelty, noveltyState: !selectedNovelty.noveltyState }
        });
        setConfirmOpen(false);
        setAlert({ message: 'Estado de novedad actualizado', type: 'success' });
        fetchNovelties();
      } catch (e) {
        setAlert({ message: 'Error al actualizar estado', type: 'error' });
      }
    }
  };

  // Handlers para cerrar modales
  const handleAddClose = () => setAddOpen(false);
  const handleDetailsClose = () => setDetailsOpen(false);
  const handleConfirmClose = () => setConfirmOpen(false);

  if (loading) return <LoadingGrid />;
  if (error) return <div className="text-red-500">{typeof error === 'string' ? error : error?.message || 'Error desconocido'}</div>;

  return (
    <div>
      {alert.message && <Alert message={alert.message} type={alert.type} duration={3000} />}
      <NoveltyGrid
        items={filteredItems}
        darkMode={darkMode}
        onUpdateClick={handleUpdateClick}
        onInfoClick={handleInfoClick}
        onRegisterClick={handleRegisterClick}
        onAddClick={handleAddClick}
        showAddCard={canAddNovelties}
      />
      <NoveltyModals
        addOpen={addOpen}
        onAddClose={handleAddCancel}
        detailsOpen={detailsOpen}
        onDetailsClose={handleDetailsClose}
        detailsNovelty={selectedNovelty || undefined}
        confirmOpen={confirmOpen}
        onConfirmClose={handleConfirmClose}
        onConfirm={handleConfirm}
        confirmNoveltyName={selectedNovelty?.nameNovelty || ''}
        confirmNoveltyState={!!selectedNovelty?.noveltyState}
      >
        {addOpen && (
          <NoveltyForm
            initialValues={formInitialValues}
            onSubmit={handleAddSubmit}
            onCancel={handleAddCancel}
            roles={roles}
          />
        )}
      </NoveltyModals>
    </div>
  );
};

export default NoveltyManagement;
