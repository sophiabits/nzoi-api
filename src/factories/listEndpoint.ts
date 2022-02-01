import { XMLParser } from 'fast-xml-parser';

import type Resource from '../resources/Resource';

type NoOptions = '__no_options__';

// If an options type is supplied, the `path` field can be a function which returns a path
// based on the supplied options.
type PathFn<Options = NoOptions> = Options extends NoOptions
  ? string
  : string | ((opts?: Options) => string);

interface ListEndpointOpts<Output, Options = NoOptions> {
  path: PathFn<Options>;
  /** @example 'submissions' */
  rootKey: string;
  /** @example 'submission' */
  itemKey: string;
  transform: (doc: any) => Output;
}

interface ListEndpointFactory {
  <Output, Options>(opts: ListEndpointOpts<Output, Options>): (opts?: Options) => Promise<Output[]>;
  <Output>(opts: ListEndpointOpts<Output>): () => Promise<Output[]>;
}

const listEndpoint: ListEndpointFactory = <Output, Options>(
  opts: ListEndpointOpts<Output, Options>,
) => {
  async function list(this: Resource, maybeOptions?: Options) {
    const result = await this.http.request({
      method: 'GET',
      path: typeof opts.path === 'function' ? opts.path(maybeOptions) : opts.path,
    });

    const doc = new XMLParser().parse(result.data);

    const items: any[] = doc[opts.rootKey][opts.itemKey];
    return items.map((item) => opts.transform(item));
  }

  return list;
};

export default listEndpoint;
