![QA Flag](/assets/qaflag.png)

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

# Defining a Suite

## Example

```typescript
import { Scenario, Suite } from '@qaflag/core';
import { JsonResponse, JsonScenario } from '@qaflag/json';

export class UsersSuite extends Suite(JsonScenario, {
  title: 'Test Users Endpoints',
}) {
  @Scenario({
    uri: 'GET https://jsonplaceholder.typicode.com/users',
    step: 1,
    statusCode: 200,
    schema: '@getUsers',
  })
  async getListOfUsers(response: JsonResponse) {
    const ids = response.find('[*].id').array;
    ids.length.must.be.greaterThan(0);
    ids.first.number.must.be.greaterThan(0);
    this.set('userId', ids.first.$);
  }

  @Scenario({
    description: 'Get one user',
    uri: 'GET https://jsonplaceholder.typicode.com/users/{userId}',
    step: 2,
  })
  async getOneUser(response: JsonResponse) {
    response.find('email').must.be.an.email();
    response.find('email').type.must.be.a.string();
  }
}
```
