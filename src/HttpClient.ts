import axios, { Axios, AxiosResponse } from 'axios';
import cheerio from 'cheerio';

import type { NzoiConfig, RequestOptions } from './types';

import { NzoiAssertionError } from './Error';

const getSetCookieOrDie = (response: AxiosResponse) => {
  const setCookieHeader = response.headers['set-cookie'];
  if (!setCookieHeader || setCookieHeader.length === 0) {
    throw new Error();
  }

  return setCookieHeader[0];
};

export default class HttpClient {
  private axios: Axios;
  private readyPromise: Promise<unknown>;
  private sessionId: string | null = null;

  constructor(config: Required<NzoiConfig>) {
    this.axios = axios.create({
      baseURL: `https://${config.host}`,
      maxRedirects: 0,
      withCredentials: true,
    });

    this.readyPromise = this.__createSession(config.username, config.password);
  }

  async ready() {
    await this.readyPromise;
  }

  async request(options: RequestOptions) {
    await this.ready();
    if (this.sessionId === null) {
      throw new NzoiAssertionError('sessionId is null after awaiting ready() in HttpClient?');
    }

    const { method, params, path } = options;

    return this.axios.request({
      headers: {
        Cookie: this.sessionId,
      },
      method,
      params,
      url: path,
    });
  }

  private async __createSession(username: string, password: string) {
    // Step 1: Load the sign in page and grab the guest session ID & the CSRF token value
    const guestResponse = await this.axios.get('/accounts/sign_in');
    const $ = cheerio.load(guestResponse.data);
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    // Step 2: Sign in via credentials
    const loginResponse = await this.axios.post(
      '/accounts/sign_in',
      new URLSearchParams({
        utf8: '✓',
        authenticity_token: csrfToken!,
        'user[email]': username,
        'user[password]': password,
        'user[remember_me]': '0',
        commit: 'Sign in',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: getSetCookieOrDie(guestResponse),
        },
        validateStatus: (status) => (status >= 200 && status < 300) || status === 302,
      },
    );

    // Read authenticated session id
    this.sessionId = getSetCookieOrDie(loginResponse);
  }
}
