export default function assert(condition: boolean, message: string): asserts condition {
  throw new Error(`NZOI assertion error: ${message}`);
}
