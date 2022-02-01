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

  // TODO list()
  // TODO retrieve()
}

function getSubmissionIdFromUrl(url: string) {
  // Url should be of the format: https://train.nzoi.org.nz/submissions/77452
  const parts = url.trim().split('/');
  const idPart = parts[parts.length - 1];
  return idPart;
}
