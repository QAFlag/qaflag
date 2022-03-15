import { Scenario } from './common/decorators/scenario.decorator';
import { Suite } from './common/mixin/suite.mixin';
import { JsonResponse } from './json/json.response';
import { JsonScenario } from './json/json.scenario';

class UsersSuite extends Suite(JsonScenario, {
  title: 'Test Users Endpoints',
}) {
  @Scenario({
    uri: 'GET https://jsonplaceholder.typicode.com/users',
    description: 'adsfasd',
    step: 1,
  })
  async getListOfUsers(response: JsonResponse) {
    const status = response.statusCode;
    response.log({ text: `${status.name} = ${status.toString()}` });
  }

  @Scenario({
    description: 'Get one user',
    uri: 'GET https://jsonplaceholder.typicode.com/users/{userId}',
    step: 2,
  })
  async test2() {}

  @Scenario({
    description: 'Get one user',
    uri: 'GET https://jsonplaceholder.typicode.com/users/1',
    step: 2,
  })
  async test3() {}
}

const suite = new UsersSuite();
