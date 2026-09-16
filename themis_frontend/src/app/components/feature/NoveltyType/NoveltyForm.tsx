import React, { useState } from 'react';
import useFormValidation from './useFormValidation';

interface NoveltyFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  roles?: any[];
}

const maxCharLimit = 250;

const NoveltyForm: React.FC<NoveltyFormProps> = ({ initialValues = {}, onSubmit, onCancel, roles = [] }) => {

  
  const [formValues, setFormValues] = useState(initialValues);
  const [charCount, setCharCount] = useState(formValues.description?.length || 0);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(initialValues.roles ? initialValues.roles.map((r: any) => r.id?.toString()) : []);
  const { errors, validate } = useFormValidation(formValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === 'description') setCharCount(value.length);
  };

  const handleRoleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedRoles = checked
      ? [...selectedRoleIds, value]
      : selectedRoleIds.filter((id) => id !== value);
    setSelectedRoleIds(updatedRoles);
    setFormValues({ ...formValues, roles: updatedRoles.map(id => ({ id })) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onSubmit({
        ...formValues,
        noveltyState: true,
        externalRoleIds: selectedRoleIds,
      });
    }
  };

  // Unifica roles únicos y con nombre
  const uniqueRoles = Array.isArray(roles)
    ? roles.filter((role, idx, arr) =>
        typeof role.id !== 'undefined' &&
        arr.findIndex(r => r.id === role.id) === idx
      )
    : [];

  return (
    <form onSubmit={handleSubmit} className=" space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          name="nameNovelty"
          value={formValues.nameNovelty || ''}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border ${errors.nameNovelty ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-darkGreen/30 focus:border-darkGreen transition-all`}
          placeholder="Ingrese el nombre de la novedad"
        />
        {errors.nameNovelty && <p className="text-red-500 text-sm mt-1">{errors.nameNovelty}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">¿En qué momento se puede tramitar?</label>
        <input
          type="text"
          name="procedureDescription"
          value={formValues.procedureDescription || ''}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border ${errors.noveltyState ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-darkGreen/30 focus:border-darkGreen transition-all`}
          placeholder="Describa cuándo se puede tramitar"
        />
        {errors.noveltyState && <p className="text-red-500 text-sm mt-1">{errors.noveltyState}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Completa de la Novedad</label>
        <textarea
          name="description"
          value={formValues.description || ''}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-darkGreen/30 focus:border-darkGreen transition-all h-32`}
          placeholder="Describa detalladamente la novedad"
          maxLength={maxCharLimit}
        />
        <div className="flex justify-between text-sm mt-1">
          {errors.description && <p className="text-red-500">{errors.description}</p>}
          <p className={`text-gray-500 ${charCount === maxCharLimit ? 'text-red-500' : ''}`}>{charCount}/{maxCharLimit}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
        <div className="max-h-[200px] overflow-y-auto bg-gray-50 p-4 border border-gray-300 rounded-lg">
          <div className="grid grid-cols-1 gap-2">
            {uniqueRoles.length > 0 ? (
              uniqueRoles.map((role: any) => (
                <div key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    value={role.id}
                    checked={selectedRoleIds.includes(role.id.toString())}
                    onChange={handleRoleCheckboxChange}
                    className="w-4 h-4 text-darkGreen border-gray-300 rounded focus:ring-darkGreen"
                  />
                  <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-700">
                    {role.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-2 col-span-2">Cargando roles...</p>
            )}
          </div>
          {uniqueRoles.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-2">No hay roles disponibles</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="w-full px-4 py-3 bg-darkGreen text-white rounded-full hover:bg-hoverGreen shadow-lg hover:shadow-darkGreen/30 transition-all duration-200 text-sm font-medium">Guardar</button>
        <button type="button" className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 shadow transition-all duration-200 text-sm font-medium" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default NoveltyForm;
