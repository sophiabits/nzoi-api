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

  limits: {
    memory: number;
    time: number;
  };
  submissions: {
    correct: number;
    incorrect: number;
  };
}

export type ResourceId = string | number;

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number>;
  path: string;
}
