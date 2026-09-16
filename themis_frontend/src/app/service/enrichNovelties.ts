import { Student } from '@/redux/features/studentSlice';

export function enrichNoveltiesWithStudent(novelties: any[], students: Student[]) {
  return novelties.map(novelty => {
  // Backend may return student object or legacy idStudent field. Prefer `student.id` or `studentId`.
  const studentId = novelty.student?.id || novelty.studentId || novelty.idStudent;
  const student = students.find(s => String(s.id) === String(studentId));
    return {
      ...novelty,
      nameApprendice: student ? student.person?.name : 'Desconocido',
      docuApprendice: student ? student.person?.document : 'N/A',
      program: student && student.studentStudySheets?.[0]?.studySheet.trainingProject?.program?.name ? student.studentStudySheets[0].studySheet.trainingProject.program.name : 'N/A',
      studySheet: student && student.studentStudySheets?.[0]?.studySheet.number ? student.studentStudySheets[0].studySheet.number : 'N/A',
    };
  });
}