declare namespace Nzoi {
  interface Auth {}

  /**
   * Not all languages are guaranteed to be here.
   */
  enum Language {
    C11 = 12,
    C99 = 4,
    Cpp03 = 1,
    Cpp11 = 5,
    Cpp14 = 10,
    Cpp17 = 11,
    Csharp = 16,
    Haskell2010 = 3,
    J = 9,
    Java11 = 13,
    Java6 = 6,
    Javascript = 15,
    Python27 = 2,
    Python34 = 7,
    Python36PyPy = 17,
    Python38 = 14,
    Ruby22 = 8,
  }

  enum LanguageFamily {
    C = 'c',
    Cpp = 'cpp',
    Csharp = 'csharp',
    Haskell = 'haskell',
    J = 'j',
    Java = 'java',
    Javascript = 'javascript',
    Ruby = 'ruby',
    Python = 'python',
  }

  interface Config {
    /**
     * The authentication scheme to use with NZOI.
     */
    auth: Auth;
    host?: string;
  }

  interface Evaluator {
    id: string;
    name: string;
    description: string;
    source: string;
    ownerId: string;

    createdAt: string;
    updatedAt: string;
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

  interface ProblemSet {
    id: string;
    name: string;
    ownerId: string;
    // TODO problemIds

    createdAt: string;
    updatedAt: string;
  }

  interface Submission {
    id: string;

    createdAt: string;
    judgedAt: string;
    updatedAt: string;

    /**
     * From 0..1, represents the overall % the user scored with this submission.
     */
    evaluation: number;
    language: Language;
    source: string;
    problemId: string;
    userId: string;
  }

  interface CreateSubmissionParams {
    language: Language;
    source: string;
    problemId: ResourceId;
  }

  interface ListSubmissionsFilterByUser {
    userId: ResourceId | 'me';
  }

  interface ListSubmissionsFilterByProblem {
    problemId: ResourceId;
  }

  interface ListSubmissionsParams {
    where?: ListSubmissionsParams.Where;
  }

  namespace ListSubmissionsParams {
    interface WhereByProblem {
      problemId: ResourceId;
    }

    interface WhereByUser {
      userId: UserId;
    }

    type Where = WhereByProblem | WhereByUser | {};
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
  type UserId = ResourceId | 'me';

  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  interface CommonRequestOptions {
    authenticityToken?: string;
    params?: Record<string, string | number>;
    path: string;
  }

  interface PostFormRequestOptions extends CommonRequestOptions {
    method: 'POST';
    type: 'form';
  }

  interface GenericRequestOptions extends CommonRequestOptions {
    method: RequestMethod;
    type?: undefined;
  }

  type RequestOptions = PostFormRequestOptions | GenericRequestOptions;
}
