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
    test(response.statusCode).between(200, 299);
    const ids = response.find('[*].id').array;
    ids.length.is.greaterThan(0);
    ids.first.number.is.greaterThan(0);
    this.set('userId', ids.first.$);
  }

  @Scenario({
    description: 'Get one user',
    uri: 'GET https://jsonplaceholder.typicode.com/users/{userId}',
    step: 2,
  })
  async getOneUser(response: JsonResponse) {
    response.find('email').is.email();
  }
}

const suite = new UsersSuite();
