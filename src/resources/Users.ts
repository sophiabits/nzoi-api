import retrieveEndpoint from '../factories/retrieveEndpoint';

import Resource from './Resource';

function transformUser(doc: any): Nzoi.User {
  return {
    id: doc.id.toString(),
    avatar: doc.avatar.url,
    country: doc.country,
    email: doc.email,
    name: doc.name,
    username: doc.username,

    createdAt: doc['created-at'],
    updatedAt: doc['updated-at'],
  };
}

export default class Users extends Resource {
  // TODO list()

  retrieve = retrieveEndpoint<Nzoi.User>({
    path: '/user/:id.xml',
    rootKey: 'user',
    transform: transformUser,
  });
}
