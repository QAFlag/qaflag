import { Mock, Scenario, Suite, Template } from '@qaflag/core';
import { JsonResponse, JsonScenario } from '@qaflag/json';
import { readFileSync } from 'fs';
import path = require('path');
import { GuestPersona } from '../personas/guest.persona';
import { StandardUserPersona } from '../personas/user.persona';

Mock.on('GET http://rest-api/users', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/users.json'),
      'utf8',
    );
  },
});

Mock.on('GET http://rest-api/users/1', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/user-1.json'),
      'utf8',
    );
  },
});

Mock.on('GET http://rest-api/users/10', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/user-10.json'),
      'utf8',
    );
  },
});

const GetList = Template({
  uri: 'GET http://rest-api/users',
  step: 1,
  statusCode: 200,
  persona: StandardUserPersona,
  schema: '@getUsers',
});

export class UsersSuite extends Suite(JsonScenario, {
  title: 'Test Users Endpoints',
  persona: GuestPersona,
}) {
  @GetList() async getListOfUsers(response: JsonResponse) {
    response.requestDuration.is.optionally.lessThan(100);
    const ids = response.find('[*].id').array;
    ids.length.is.greaterThan(0);
    ids.first.number.is.greaterThan(0);
    this.set('firstUserId', ids.first.$);
    this.set('lastUserId', ids.last.$);
  }

  @Scenario({
    description: 'Get first user',
    uri: 'GET http://rest-api/users/{firstUserId}',
    step: 2,
  })
  async getFirstUser(response: JsonResponse) {
    response.find('email').is.email();
    response.find('email').type.is.equalTo('string');
  }

  @Scenario({
    description: 'Get the last user in the list',
    uri: 'GET http://rest-api/users/{lastUserId}',
    step: 2,
  })
  async getLastUser(response: JsonResponse) {
    response.find('email').is.email();
    response.find('email').type.is.equalTo('string');
  }
}
