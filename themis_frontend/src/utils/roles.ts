export type RoleType = 'instructor' | 'coordinador' | 'aprendiz' | 'admin';

/**
 * Normaliza distintos nombres de rol (en inglés/español/variantes) a los RoleType usados por Themis
 */
export const normalizeRole = (role?: string): RoleType => {
  if (!role) return 'aprendiz';
  const lower = role.toString().toLowerCase();

  if (lower.includes('instructor')) return 'instructor';
  if (lower.includes('coordinador') || lower.includes('coordinator')) return 'coordinador';
  if (lower.includes('admin') || lower.includes('super')) return 'admin';
  // Considerar aprendiz / apprentice / user como aprendiz
  if (lower.includes('appren') || lower.includes('aprendiz') || lower === 'user') return 'aprendiz';

  return 'aprendiz';
};

export default normalizeRole;
