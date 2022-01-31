import { AxiosResponse } from 'axios';
import type Resource from '../resources/Resource';

interface RetrieveEndpointOpts<Output> {
  /** The string :id will be replaced with the actual id requested */
  path: string;
  /** Should convert the Axios response object into a JSON representation of the resource */
  transform: (response: AxiosResponse) => Output;
}

export interface RetrieveFn<Output> {
  /** Used for fetching a single resource by id. */
  (this: Resource, id: Nzoi.ResourceId): Promise<Output>;

  /** Overloaded version of `retrieve()` which can return multiple resources. */
  (this: Resource, ids: Nzoi.ResourceId[]): Promise<Output[]>;
}

export default function retrieveEndpoint<Output>(
  opts: RetrieveEndpointOpts<Output>,
): RetrieveFn<Output> {
  const { path: pathTemplate, transform } = opts;

  async function retrieve(
    this: Resource,
    idOrIds: Nzoi.ResourceId | Nzoi.ResourceId[],
  ): Promise<any> {
    const isMultiRetrieve = Array.isArray(idOrIds);
    const ids = isMultiRetrieve ? idOrIds : [idOrIds];

    const documents = await Promise.all(
      ids.map(async (id) => {
        const response = await this.http.request({
          method: 'GET',
          path: pathTemplate.replace(':id', id.toString()),
        });

        return transform(response);
      }),
    );

    if (isMultiRetrieve) {
      return documents;
    } else {
      return documents[0];
    }
  }

  return retrieve;
}
