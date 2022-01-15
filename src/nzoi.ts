import Problems from './resources/Problems';
import ProblemSets from './resources/ProblemSets';
import Submissions from './resources/Submissions';
import Users from './resources/Users';

import HttpClient from './HttpClient';

import { DEFAULT_NZOI_HOST } from './config';
import type { NzoiConfig } from './types';

export class Nzoi {
  // Resources
  problems: Problems;
  problemSets: ProblemSets;
  submissions: Submissions;
  users: Users;

  private http: HttpClient;

  constructor(config: NzoiConfig) {
    this.http = new HttpClient({
      host: DEFAULT_NZOI_HOST,
      ...config,
    });

    this.problems = new Problems(this.http);
    this.problemSets = new ProblemSets(this.http);
    this.submissions = new Submissions(this.http);
    this.users = new Users(this.http);
  }
}
