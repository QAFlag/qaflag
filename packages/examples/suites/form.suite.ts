import { Form, Scenario, Suite } from '@qaflag/core';
import { JsonContext, JsonScenario } from '@qaflag/json';

export class FormSuite extends Suite({
  title: 'Test Form Data',
  type: JsonScenario,
}) {
  @Scenario({
    uri: 'POST https://postman-echo.com/post',
    data: Form({
      foo: 'bar',
    }),
  })
  async postForm(context: JsonContext) {
    context.debug(context.document);
  }
}
