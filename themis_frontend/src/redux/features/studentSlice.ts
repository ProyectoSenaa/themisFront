import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '@/lib/apollo-provider';
import { GET_STUDENTS, GET_STUDENT_LIST,ADD_STUDENT,UPDATE_STUDENT,DELETE_STUDENT} from '@/app/graphqlServices/studentGraphql';

// Interfaces(tipos)
export interface Student {
  id: string;
  state: string;
  person: {
    id: string;
    name: string;
    lastname: string;
    document: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  studentStudySheets: Array<{
    studySheet: {
      id: string;
      number: string;
      state: string;
      trainingProject: {
        id: string;
        name: string;
        program: {
          id: string;
          name: string;
        };
      };
    };
  }>;
}

export interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedStudent: Student | null;
}

export interface PaginationParams {
  name?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface StudentResponse {
  data: Student[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  selectedStudent: null,
};

export const fetchStudents = createAsyncThunk<
  StudentResponse,
  PaginationParams,
  { rejectValue: { message: string } }
>(
  'student/fetchAll',
  async (params = {page: 0, size: 5}, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_STUDENTS,
        variables: params,
        fetchPolicy: 'network-only',
      });
      if (!data || !data.allStudents) {
        throw new Error('No se recibieron datos de estudiantes');
      }
      return {
        data: data.allStudents.data || [],
        totalItems: data.allStudents.totalItems || 0,
        totalPages: data.allStudents.totalPages || 0,
        currentPage: data.allStudents.currentPage || 0,
      };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Error al obtener los estudiantes',
      });
    }
  }
);

export const fetchStudentList = createAsyncThunk<
  Student[],
  void,
  { rejectValue: { message: string } }
>(
  'student/fetchStudentList',
  async (_, { rejectWithValue }) => {
    try{
      const { data } = await client.query({
        query: GET_STUDENT_LIST,
        fetchPolicy: 'network-only',
      });
      if (!Array.isArray(data.allStudentList.data)) {
        throw new Error('La respuesta no contiene una lista válida de estudiantes');
      }
      
      return data.allStudentList.data || [];
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Error al obtener los estudiantes',
      });
    }
  }
);

export const addStudent = createAsyncThunk<
  Student,
  { student: Student },
  { rejectValue: { message: string } }
>(
  'student/addStudent',
  async ({ student }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_STUDENT,
        variables: { student },
      });
      return data.addStudent;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Error al agregar el estudiante',
      });
    }
  }
);


export const updateStudent = createAsyncThunk<
  Student,
  { id: string; student: Student },
  { rejectValue: { message: string } }
>(
  'student/updateStudent',
  async ({ id, student }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_STUDENT,
        variables: { id, student },
      });
      return data.updateStudent;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Error al actualizar el estudiante',
      });
    }
  }

);

export const deleteStudent = createAsyncThunk<
Student,
{ id: string; student: Student },
{ rejectValue: { message: string } }
>(
  'student/deleteStudent',
  async({id},{rejectWithValue}) =>{
    try{
      const {data} = await client.mutate({
        mutation:DELETE_STUDENT,
        variables:{id},
      });
      return data.deleteStudent;
    }catch(error:any){
      return rejectWithValue({
        message: error.message || 'Error al elimiar el estudiante',
      });
    }
  }
);


export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || 'Error al cargar los estudiantes';
      });
  },
});


export const { setSelectedStudent, clearSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
