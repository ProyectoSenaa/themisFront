import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definir la interfaz para el estado
type ThemeState = {
  darkMode: boolean;
};

// Función para obtener el modo inicial de forma segura
const getInitialDarkMode = (): boolean => {
  // Verificar si estamos en el navegador antes de acceder a localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem("darkMode") === "true";
  }
  // Valor predeterminado para el servidor
  return false;
};

// Obtener el estado inicial
const initialState: ThemeState = {
  darkMode: getInitialDarkMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Verificar si estamos en el navegador antes de acceder a localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
      }
    },
  },
});

// Exportar la acción
export const { toggleDarkMode } = themeSlice.actions;

// Exportar el reducer
export default themeSlice.reducer;