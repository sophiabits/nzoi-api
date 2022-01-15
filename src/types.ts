export interface NzoiConfig {
  host?: string;
  password: string;
  username: string;
}

/** @see https://github.com/NZOI/nztrain/blob/e34b7e87f6aebd411f85779f34a50be93a17a90e/db/schema.rb#L368 */
export interface NzoiProblem {
  id: string;
  name: string;
  statement: string;
  url: string;

  limits: NzoiProblemLimits;
  stats: NzoiProblemStatistics;
}

export interface NzoiProblemLimits {
  memory: number;
  time: number;
}

export interface NzoiProblemStatistics {
  correct: number;
  incorrect: number;
  total: number;
}

export interface NzoiUser {
  id: string;
  avatar: string;
  email: string;
  name: string;
  username: string;
  /** Two character ISO country code */
  country: string;

  /** In ISO format */
  createdAt: string;
  /** In ISO format */
  updatedAt: string;
}

export type ResourceId = string | number;

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number>;
  path: string;
}
