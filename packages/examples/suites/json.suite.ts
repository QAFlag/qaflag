import { Scenario, Suite, Template } from '@qaflag/core';
import { JsonContext, JsonScenario } from '@qaflag/json';
import { UserDto } from '../schemas/user.dto';
import { GuestUser } from '../personas/guest.persona';
import { StandardUser } from '../personas/user.persona';
import initMocks from '../mocks/json';

initMocks();

const Guest = new GuestUser();
const Standard = new StandardUser();

const GetList = Template({
  uri: 'GET /users',
  step: 1,
  statusCode: 200,
  persona: Standard,
  schema: '@getUsers',
});

export class UsersSuite extends Suite({
  title: 'Test Users Endpoints',
  persona: Guest,
  type: JsonScenario,
}) {
  @GetList()
  async getListOfUsers(context: JsonContext) {
    context.document.must.be.an.array();
    context.document.must.not.be.an.object();
    context.requestDuration.should.be.lessThan(100);
    await context.case('Test List', async () => {
      const items = context.find('[*]');
      items.must.all.match.dto(UserDto);
      items.must.be.an.array();
      items.must.all.have.properties(['name', 'username']);
      items.must.have.length.be.greaterThan(0);
      items.array.length.must.be
        .greaterThan(0)
        .and.must.be.lessThan(100)
        .and.must.be.a.positiveInteger();
    });
    const ids = context.find('[*].id');
    ids.must.have.some.be.containedIn(['1', '2']);
    ids.must.all.be.greaterThan(0);
    ids.must.not.have.any.be.lessThan(0);
    ids.must.have.some.be.greaterThan(0);
    ids.must.have.only(1).be.equalTo(1);
    ids.must.have.atLeast(5).be.greaterThan(2);
    ids.must.have.atMost(2).be.lessThan(3);
    const names = context.find('[*].name').array;
    names.length.must.be.equalTo(10);
    names.first.must.have.length.be.greaterThan(0);
    names.first.length.must.be.greaterThan(0);
    this.set('firstUserId', ids.array.first.$);
    this.set('lastUserId', ids.array.last.$);
    names.must.be.an.arrayOf('string');
  }

  @Scenario({
    description: 'Get first user',
    uri: 'GET /users/{firstUserId}',
    persona: Standard,
    schema: {
      name: '@userJtd',
      type: 'jtd',
    },
    step: 2,
  })
  async getFirstUser(context: JsonContext) {
    const email = context.find('email');
    email.must.be.an.email();
    email.must.be.a.string();
    email.length.must.be.between(1, 100);
    email.must.contain('@');
  }

  @Scenario({
    description: 'Get the last user in the list',
    uri: 'GET /users/{lastUserId}',
    schema: UserDto,
    persona: Standard,
    step: 2,
  })
  async getLastUser(context: JsonContext) {
    if (context.find('email').could.be.a.string().passes) {
      context.find('email').must.be.email();
    }
    context.document.must.match.dto(UserDto);
    context.document.must.match.jsonSchema('@user');
    context.document.must.match.jtd('@userJtd');
  }
}
