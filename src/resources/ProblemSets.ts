import Resource from './Resource';

export default class ProblemSets extends Resource {
  // TODO list()

  retrieve(id: Nzoi.ResourceId) {
    this.http.request({
      method: 'GET',
      params: {},
      path: '/',
    });
  }
}
