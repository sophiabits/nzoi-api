import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import cheerio from 'cheerio';

import { CredentialAuth, SessionIdAuth } from './auth';

import assert from './lib/assert';

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

  constructor(config: Required<Nzoi.Config>) {
    this.axios = axios.create({
      baseURL: `https://${config.host}`,
      maxRedirects: 0,
      withCredentials: true,
    });

    if (config.auth instanceof SessionIdAuth) {
      this.sessionId = config.auth.sessionId;
      this.readyPromise = Promise.resolve();
    } else if (config.auth instanceof CredentialAuth) {
      this.readyPromise = this.__createSession(config.auth.username, config.auth.password);
    } else {
      assert(false, 'Invalid `auth` object supplied to HttpClient');
    }
  }

  makeUrl(path: string) {
    // This method does not respect baseURL
    // See: https://github.com/axios/axios/issues/2468
    return this.axios.getUri({
      method: 'GET',
      url: `${this.axios.defaults.baseURL!}${path}`,
    });
  }

  async getAuthenticityToken(path: string) {
    const response = await this.axios.get(path);
    const $ = cheerio.load(response.data);
    const token = $('meta[name="csrf-token"]').attr('content')!;

    return { token, response };
  }

  async getSessionId() {
    await this.readyPromise;
    assert(this.sessionId !== null, 'sessionId is null after awaiting ready() in HttpClient?');

    return this.sessionId;
  }

  async ready() {
    await this.readyPromise;
  }

  async request(options: Nzoi.RequestOptions) {
    await this.ready();
    assert(this.sessionId !== null, 'sessionId is null after awaiting ready() in HttpClient?');

    const { method, params, path } = options;

    const config: AxiosRequestConfig<any> = {
      headers: {
        Cookie: this.sessionId,
      },
      method,
      url: path,
    };

    if (method === 'POST' && options.type === 'form') {
      const form = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          form.set(key, value.toString());
        });
      }

      config.headers!['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      config.params = params;
    }

    return this.axios.request(config);
  }

  private async __createSession(username: string, password: string) {
    // Step 1: Load the sign in page and grab the guest session ID & the CSRF token value
    const { token: csrfToken, response: guestResponse } = await this.getAuthenticityToken(
      '/accounts/sign_in',
    );

    // Step 2: Sign in via credentials
    const loginResponse = await this.axios.post(
      '/accounts/sign_in',
      new URLSearchParams({
        utf8: '???',
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
