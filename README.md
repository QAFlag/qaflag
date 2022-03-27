![QA Flag](/assets/qaflag.png)

This project is in the early stages. It will be a mono-repo, so we are using lerna.

Currently the index.ts doesn't export... it only serves as my base that be like "you still ok?" and that it runs. That will of course change soon, and I'll add a bunch of tests and examples.

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
import { Scenario, JsonResponse, JsonScenario, Suite } from '@qaflag/core';

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
}
```
