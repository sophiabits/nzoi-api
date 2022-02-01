import { XMLParser } from 'fast-xml-parser';

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

  async list(params: Nzoi.ListSubmissionsParams): Promise<Nzoi.Submission[]> {
    const where: Nzoi.ListSubmissionsParams.Where = params.where || {};

    const path =
      'problemId' in where
        ? `/submissions/by_problem/${where.problemId}.xml`
        : 'userId' in where
        ? where.userId === 'me'
          ? `/submissions/my.xml`
          : `/submissions/by_user/${where.userId}.xml`
        : `/submissions.xml`;

    const response = await this.http.request({
      method: 'GET',
      path,
    });

    // TODO: Errors

    const xmlDoc = new XMLParser().parse(response.data);
    return xmlDoc.submissions.submission.map((submission: any) =>
      transformSubmission({ submission }),
    );
  }

  retrieve = retrieveEndpoint<Nzoi.Submission>({
    path: '/user/:id.xml',
    transform: (response) => transformSubmission(new XMLParser().parse(response.data)),
  });
}

function getSubmissionIdFromUrl(url: string) {
  // Url should be of the format: https://train.nzoi.org.nz/submissions/77452
  const parts = url.trim().split('/');
  const idPart = parts[parts.length - 1];
  return idPart;
}

function transformSubmission(xmlDoc: any): Nzoi.Submission {
  return {
    id: xmlDoc.submission.id.toString(),
    createdAt: xmlDoc.submission['created-at'],
    evaluation: xmlDoc.submission.evaluation,
    judgedAt: xmlDoc.submission['judged-at'],
    language: xmlDoc.submission['language-id'] as Nzoi.Language,
    source: xmlDoc.submission.source,
    problemId: xmlDoc.submission['problem-id'].toString(),
    updatedAt: xmlDoc.submission['updated-at'],
    userId: xmlDoc.submission['user-id'].toString(),
  };
}
