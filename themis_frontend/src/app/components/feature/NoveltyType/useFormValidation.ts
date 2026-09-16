import { useState } from 'react';

export interface FormErrors {
  nameNovelty?: string;
  noveltyState?: string;
  description?: string;
}

export const useFormValidation = (formValues: any) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formValues?.nameNovelty) {
      newErrors.nameNovelty = 'El campo del nombre es obligatorio';
    }
    if (!formValues?.procedureDescription) {
      newErrors.noveltyState = 'El tiempo en que se puede tramitar la novedad es obligatorio';
    }
    if (!formValues?.description) {
      newErrors.description = 'La descripción del tipo de novedad es obligatoria';
    }
    setErrors(newErrors);
    return Object.values(newErrors).some(error => error !== undefined && error !== '');
  };

  return { errors, validate };
};

export default useFormValidation;
