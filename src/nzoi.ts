import Evaluators from './resources/Evaluators';
import Problems from './resources/Problems';
import ProblemSets from './resources/ProblemSets';
import Submissions from './resources/Submissions';
import Users from './resources/Users';

import HttpClient from './HttpClient';

import { DEFAULT_NZOI_HOST } from './config';

export class Nzoi {
  // Resources
  evaluators: Evaluators;
  problems: Problems;
  problemSets: ProblemSets;
  submissions: Submissions;
  users: Users;

  private http: HttpClient;

  constructor(config: Nzoi.Config) {
    this.http = new HttpClient({
      host: DEFAULT_NZOI_HOST,
      ...config,
    });

    this.evaluators = new Evaluators(this.http);
    this.problems = new Problems(this.http);
    this.problemSets = new ProblemSets(this.http);
    this.submissions = new Submissions(this.http);
    this.users = new Users(this.http);
  }

  async getSessionId() {
    return this.http.getSessionId();
  }
}
