import { ResourceId } from '../types';
import Resource from './Resource';

export default class ProblemSets extends Resource {
  retrieve(id: ResourceId) {
    this.http.request({
      method: 'GET',
      params: {},
      path: '/',
    });
  }
}
