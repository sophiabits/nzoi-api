import { XMLParser } from 'fast-xml-parser';

import retrieveEndpoint from '../factories/retrieveEndpoint';
import type { NzoiUser } from '../types';

import Resource from './Resource';

function transformUser(xml: string): NzoiUser {
  const doc = new XMLParser().parse(xml);

  return {
    id: doc.user.id.toString(),
    avatar: doc.user.avatar.url,
    country: doc.user.country,
    email: doc.user.email,
    name: doc.user.name,
    username: doc.user.username,

    createdAt: doc.user['created-at'],
    updatedAt: doc.user['updated-at'],
  };
}

export default class Users extends Resource {
  // TODO list()

  retrieve = retrieveEndpoint<NzoiUser>({
    path: '/user/:id.xml',
    transform: (response) => transformUser(response.data),
  });
}
