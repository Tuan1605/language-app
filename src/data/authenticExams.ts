import type { AuthenticExam } from '../types';

import toeicMock1 from './authentic/toeic-mock-1.json';
import jlptN2Mock1 from './authentic/jlpt-n2-mock-1.json';
import toeicAuth2 from './authentic/toeic-auth-2.json';
import toeicAuth3 from './authentic/toeic-auth-3.json';
import n2Auth2 from './authentic/n2-auth-2.json';
import n2Auth3 from './authentic/n2-auth-3.json';

export const AUTHENTIC_EXAMS: AuthenticExam[] = [
  toeicMock1 as AuthenticExam,
  jlptN2Mock1 as AuthenticExam,
  toeicAuth2 as AuthenticExam,
  toeicAuth3 as AuthenticExam,
  n2Auth2 as AuthenticExam,
  n2Auth3 as AuthenticExam,
];
