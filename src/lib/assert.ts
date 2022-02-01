import { NzoiAssertionError } from '../Error';

export default function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new NzoiAssertionError(message);
  }
}
