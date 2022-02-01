import listEndpoint from '../factories/listEndpoint';
import retrieveEndpoint from '../factories/retrieveEndpoint';

import Resource from './Resource';

export default class Evaluators extends Resource {
  list = listEndpoint<Nzoi.Evaluator>({
    path: '/evaluators.xml',
    rootKey: 'evaluators',
    itemKey: 'evaluator',

    transform: transformEvaluator,
  });

  retrieve = retrieveEndpoint<Nzoi.Evaluator>({
    path: '/evaluators/:id.xml',
    rootKey: 'evaluator',
    transform: transformEvaluator,
  });
}

function transformEvaluator(doc: any): Nzoi.Evaluator {
  return {
    id: doc.id.toString(),
    description: doc.description,
    name: doc.name,
    source: doc.source,
    ownerId: doc['owner-id'],

    createdAt: doc['created-at'],
    updatedAt: doc['updated-at'],
  };
}
