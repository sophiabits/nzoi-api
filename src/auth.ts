/**
 * Use this authentication scheme for when you are logging in to the training
 * site for the first time.
 */
export class CredentialAuth implements Nzoi.Auth {
  constructor(public username: string, public password: string) {}
}

/**
 * Use this authentication scheme when you are resuming from a previous session.
 */
export class SessionIdAuth implements Nzoi.Auth {
  constructor(public sessionId: string) {}
}
