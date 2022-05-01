import { Mock, Scenario, Suite, Template } from '@qaflag/core';
import { JsonContext, JsonScenario } from '@qaflag/json';
import { readFileSync } from 'fs';
import path = require('path');
import { UserDto } from '../schemas/user.dto';
import { GuestUser } from '../personas/guest.persona';
import { StandardUser } from '../personas/user.persona';

Mock.on('GET http://localhost/users', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/users.json'),
      'utf8',
    );
  },
});

Mock.on('GET http://localhost/users/1', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/user-1.json'),
      'utf8',
    );
  },
});

Mock.on('GET http://localhost/users/10', {
  statusCode: 200,
  data: async () => {
    return readFileSync(
      path.resolve(__dirname, '../../fixtures/user-10.json'),
      'utf8',
    );
  },
});

const GetList = Template({
  uri: 'GET /users',
  step: 1,
  statusCode: 200,
  persona: new StandardUser(),
  schema: '@getUsers',
});

export class UsersSuite extends Suite({
  title: 'Test Users Endpoints',
  persona: new GuestUser(),
  type: JsonScenario,
}) {
  @GetList()
  async getListOfUsers(context: JsonContext) {
    context.requestDuration.should.be.lessThan(100);
    const items = context.find('[*]');
    items.must.all.match.dto(UserDto);
    items.must.be.an.array();
    items.must.all.have.properties(['name', 'username']);
    items.must.have.length.greaterThan(0);
    items.array.length.must.be.greaterThan(0);
    const ids = context.find('[*].id');
    ids.must.all.be.greaterThan(0);
    ids.must.not.have.any.be.lessThan(0);
    ids.must.have.some.be.greaterThan(0);
    const names = context.find('[*].name').array;
    names.length.must.equal(10);
    names.first.must.have.length.greaterThan(0);
    names.first.length.must.be.greaterThan(0);
    this.set('firstUserId', ids.array.first.$);
    this.set('lastUserId', ids.array.last.$);
  }

  @Scenario({
    description: 'Get first user',
    uri: 'GET /users/{firstUserId}',
    schema: {
      name: '@userJtd',
      type: 'jtd',
    },
    step: 2,
  })
  async getFirstUser(context: JsonContext) {
    context.find('email').must.be.an.email();
    context.find('email').must.be.a.string();
  }

  @Scenario({
    description: 'Get the last user in the list',
    uri: 'GET /users/{lastUserId}',
    schema: UserDto,
    step: 2,
  })
  async getLastUser(context: JsonContext) {
    context.find('email').must.be.email();
    context.find('email').must.be.a.string();
    context.document.must.match.dto(UserDto);
    context.document.must.match.jsonSchema('@user');
    context.document.must.match.jtd('@userJtd');
  }
}
