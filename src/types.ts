declare namespace Nzoi {
  interface Config {
    host?: string;
    password: string;
    username: string;
  }

  /** @see https://github.com/NZOI/nztrain/blob/e34b7e87f6aebd411f85779f34a50be93a17a90e/db/schema.rb#L368 */
  interface Problem {
    id: string;
    name: string;
    statement: string;
    url: string;

    limits: Problem.Limits;
    stats: Problem.Statistics;
  }

  namespace Problem {
    interface Limits {
      memory: number;
      time: number;
    }

    interface Statistics {
      correct: number;
      incorrect: number;
      total: number;
    }
  }

  interface User {
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

  type ResourceId = string | number;

  interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, string | number>;
    path: string;
  }
}
