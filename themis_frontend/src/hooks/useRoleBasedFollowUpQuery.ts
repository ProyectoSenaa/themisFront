import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
    GET_ALL_FOLLOW_UPS,
    GET_FOLLOW_UPS_BY_STUDENT,
    GET_FOLLOW_UPS_BY_TEACHER,
    GET_FOLLOW_UPS_BY_COORDINATOR
} from '@/graphql/follow-up-queries';
import { DocumentNode } from 'graphql';

/**
 * Hook to automatically select the correct FollowUp query based on user role
 * 
 * Returns:
 * - query: GraphQL query to use
 * - variables: Variables for the query including pagination
 * - isFiltered: Whether data is filtered (true) or showing all (false)
 */
export const useRoleBasedFollowUpQuery = (page: number = 0, size: number = 10) => {
    const user = useSelector((state: RootState) => state.auth.user);

    // Normalize role name
    const userRole = user?.roles?.[0]?.name?.toLowerCase() ||
        user?.role?.toLowerCase() ||
        '';

    const userId = user?.id;
    const idPerson = user?.idPerson;

    // Select query and variables based on role
    let query: DocumentNode = GET_ALL_FOLLOW_UPS;
    let variables: any = { page, size };
    let isFiltered = false;

    if (userRole === 'aprendiz' || userRole === 'estudiante') {
        // For students: use followUpsByStudent with their person ID as studentId
        // The backend resolver expects studentId, and for students, idPerson maps to their student record
        if (idPerson) {
            query = GET_FOLLOW_UPS_BY_STUDENT;
            variables = { studentId: idPerson, page, size };
            isFiltered = true;
        }
        // If no idPerson, fall back to GET_ALL_FOLLOW_UPS
    } else if (userRole === 'instructor' || userRole === 'teacher') {
        // For instructors: filter by their person ID (which maps to teacherId)
        if (idPerson) {
            query = GET_FOLLOW_UPS_BY_TEACHER;
            variables = { teacherId: idPerson, page, size };
            isFiltered = true;
        }
        // If no idPerson, fall back to GET_ALL_FOLLOW_UPS
    } else if (userRole === 'coordinador' || userRole === 'coordinator') {
        // For coordinators: filter by their person ID (which maps to coordinatorId)
        if (idPerson) {
            query = GET_FOLLOW_UPS_BY_COORDINATOR;
            variables = { coordinatorId: idPerson, page, size };
            isFiltered = true;
        }
        // If no idPerson, fall back to GET_ALL_FOLLOW_UPS
    }
    // For 'administrador' or any other role: use GET_ALL_FOLLOW_UPS (default)

    return {
        query,
        variables,
        isFiltered,
        userRole,
        userId,
        idPerson
    };
};
