import assert from './assert';

export default function assertUnreachable(x: never): never {
  assert(false, 'Non-exhaustive switch statement');
}
