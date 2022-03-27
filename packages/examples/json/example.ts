import { Scenario, Suite, Template } from '@qaflag/core';
import { JsonResponse, JsonScenario } from '@qaflag/json';
import { GuestPersona } from '../personas/guest.persona';
import { StandardUserPersona } from '../personas/user.persona';

const GetList = Template({
  uri: 'GET https://jsonplaceholder.typicode.com/users',
  step: 1,
  statusCode: 200,
  persona: StandardUserPersona,
  schema: '@getUsers',
});

export class UsersSuite extends Suite(JsonScenario, {
  title: 'Test Users Endpoints',
  persona: GuestPersona,
}) {
  @Scenario({
    uri: 'GET https://jsonplaceholder.typicode.com/users',
    step: 1,
    statusCode: 200,
    persona: StandardUserPersona,
    schema: '@getUsers',
  })
  async getListOfUsers(response: JsonResponse) {
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
    response.find('email').type.is.equalTo('string');
  }

  @GetList({ persona: GuestPersona, statusCode: 200 }) getListNoAuth() {}
}
