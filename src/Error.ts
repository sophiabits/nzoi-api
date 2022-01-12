interface RawError {
  message?: string;
}

export class NzoiError extends Error {
  constructor(raw: string | RawError = {}) {
    super(typeof raw === 'string' ? raw : raw.message);
  }
}

export class NzoiAssertionError extends NzoiError {}
