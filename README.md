![QA Flag](/assets/qaflag.png)

# Want to use QA Flag?

For doumentation on installing and writing tests with QA Flag, see our web site:

[qaflag.com](https://www.qaflag.com/)

# Want to contribute to the QA Flag project?

This project is in the early stages. It will be a mono-repo, so we are using lerna.

Install with

```
npm run bootstrap
```

Build with

```
npm run build
```

Test with

```
npm run start
```

# Brief Example of a Test Suite

```typescript
import { Scenario, Suite } from '@qaflag/core';
import { JsonContext, JsonScenario } from '@qaflag/json';

export class UsersSuite extends Suite(JsonScenario, {
  title: 'Test Users Endpoints',
  baseUrl: 'https://jsonplaceholder.typicode.com',
}) {
  @Scenario({
    uri: 'GET /users',
    step: 1,
    statusCode: 200,
    schema: '@getUsers',
  })
  async getListOfUsers(context: JsonContext) {
    const ids = context.find('[*].id');
    ids.array.length.must.be.greaterThan(0);
    ids.must.all.be.greaterThan(0);
    this.set('userId', ids.first.$);
  }

  @Scenario({
    description: 'Get one user',
    uri: 'GET /users/{userId}',
    step: 2,
  })
  async getOneUser(context: JsonContext) {
    context.find('email').must.be.an.email();
    context.find('email').must.be.a.string();
  }
}
```

For more details please go to: [qaflag.com](https://www.qaflag.com/)
