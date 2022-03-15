import { Scenario } from './common/decorators/scenario.decorator';
import { Suite } from './common/mixin/suite.mixin';
import { test } from './common/models/test';
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
    test(response.statusCode).equals(200);
    const ids = response.find('[*].id').array;
    test(ids.length).greaterThan(0);
    test(ids.first.number).greaterThan(0);
    this.set('userId', ids.first.$);
  }

  @Scenario({
    description: 'Get one user',
    uri: 'GET https://jsonplaceholder.typicode.com/users/{userId}',
    step: 2,
  })
  async getOneUser() {}
}

const suite = new UsersSuite();
