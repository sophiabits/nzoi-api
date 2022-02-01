import listEndpoint from '../factories/listEndpoint';
import retrieveEndpoint from '../factories/retrieveEndpoint';

import Resource from './Resource';

export default class ProblemSets extends Resource {
  list = listEndpoint<Nzoi.ProblemSet>({
    path: '/problem_sets.xml',
    rootKey: 'problem-sets',
    itemKey: 'problem-set',
    transform: transformProblemSet,
  });

  retrieve = retrieveEndpoint<Nzoi.ProblemSet>({
    path: '/problem_sets/:id.xml',
    rootKey: 'problem-set',
    transform: transformProblemSet,
  });
}

function transformProblemSet(doc: any): Nzoi.ProblemSet {
  return {
    id: doc.id.toString(),
    name: doc.name,

    createdAt: doc.createdAt,
    ownerId: doc['owner-id'],
    updatedAt: doc.updatedAt,
  };
}
