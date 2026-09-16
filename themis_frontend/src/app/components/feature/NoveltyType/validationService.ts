export const validateNoveltyForm = (formValues: any) => {
  const errors: any = {};
  if (!formValues?.nameNovelty) {
    errors.nameNovelty = 'El campo del nombre es obligatorio';
  }
  if (!formValues?.procedureDescription) {
    errors.noveltyState = 'El tiempo en que se puede tramitar la novedad es obligatorio';
  }
  if (!formValues?.description) {
    errors.description = 'La descripción del tipo de novedad es obligatoria';
  }
  return errors;
};
