import retrieveEndpoint from '../factories/retrieveEndpoint';
import Resource from './Resource';

export default class Users extends Resource {
  // TODO list()

  retrieve = retrieveEndpoint<string>({
    path: '/user/:id.xml',
    transform: (response) => {
      console.log(response);
      return 'hello';
    },
  });
}
