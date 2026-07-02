import type { AuthenticExam } from '../types';

// Lazy-load exam data to reduce initial bundle size
let _exams: AuthenticExam[] | null = null;

export async function getAuthenticExams(): Promise<AuthenticExam[]> {
  if (_exams) return _exams;

  const [toeicMock1, jlptN2Mock1, toeicAuth2, toeicAuth3, n2Auth2, n2Auth3] = await Promise.all([
    import('./authentic/toeic-mock-1.json'),
    import('./authentic/jlpt-n2-mock-1.json'),
    import('./authentic/toeic-auth-2.json'),
    import('./authentic/toeic-auth-3.json'),
    import('./authentic/n2-auth-2.json'),
    import('./authentic/n2-auth-3.json'),
  ]);

  _exams = [
    toeicMock1.default as AuthenticExam,
    jlptN2Mock1.default as AuthenticExam,
    toeicAuth2.default as AuthenticExam,
    toeicAuth3.default as AuthenticExam,
    n2Auth2.default as AuthenticExam,
    n2Auth3.default as AuthenticExam,
  ];

  return _exams;
}

// Synchronous getter for when data is already loaded
export function getAuthenticExamsSync(): AuthenticExam[] {
  return _exams || [];
}
