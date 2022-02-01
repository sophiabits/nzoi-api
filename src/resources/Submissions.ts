import listEndpoint from '../factories/listEndpoint';
import retrieveEndpoint from '../factories/retrieveEndpoint';

import Resource from './Resource';

export default class Submissions extends Resource {
  /**
   * Creates a submission and then returns the newly created submission's id.
   */
  async create(params: Nzoi.CreateSubmissionParams): Promise<string> {
    const requestPath = `/problems/${params.problemId}/submit`;

    // TODO: There's a `POST /submissions.xml` controller method in the train site's code,
    //       but it's not wired up.
    const { token } = await this.http.getAuthenticityToken(requestPath);

    const response = await this.http.request({
      authenticityToken: token,
      path: requestPath,
      method: 'POST',

      params: {
        'submission[language_id]': params.language,
        'submission[source]': params.source,
      },
      type: 'form',
    });

    // TODO: Error handling

    const createdSubmissionId = getSubmissionIdFromUrl(response.headers.location);
    return createdSubmissionId;
  }

  list = listEndpoint<Nzoi.Submission, Nzoi.ListSubmissionsParams>({
    path: (params = {}) => {
      const where: Nzoi.ListSubmissionsParams.Where = params.where || {};

      return 'problemId' in where
        ? `/submissions/by_problem/${where.problemId}.xml`
        : 'userId' in where
        ? where.userId === 'me'
          ? `/submissions/my.xml`
          : `/submissions/by_user/${where.userId}.xml`
        : `/submissions.xml`;
    },

    itemKey: 'submission',
    rootKey: 'submissions',

    transform: transformSubmission,
  });

  retrieve = retrieveEndpoint<Nzoi.Submission>({
    path: '/submissions/:id.xml',
    rootKey: 'submission',
    transform: transformSubmission,
  });
}

function getSubmissionIdFromUrl(url: string) {
  // Url should be of the format: https://train.nzoi.org.nz/submissions/77452
  const parts = url.trim().split('/');
  const idPart = parts[parts.length - 1];
  return idPart;
}

function transformSubmission(doc: any): Nzoi.Submission {
  return {
    id: doc.id.toString(),
    createdAt: doc['created-at'],
    evaluation: doc.evaluation,
    judgedAt: doc['judged-at'],
    language: doc['language-id'] as Nzoi.Language,
    source: doc.source,
    problemId: doc['problem-id'].toString(),
    updatedAt: doc['updated-at'],
    userId: doc['user-id'].toString(),
  };
}
