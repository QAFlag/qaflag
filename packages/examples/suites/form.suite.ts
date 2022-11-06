import { Form, Scenario, Suite } from '@qaflag/core';
import { JsonContext, JsonScenario } from '@qaflag/json';
import * as fs from 'fs';

const FILE_PATH = './packages/examples/fixtures/logo.png';

export class FormSuite extends Suite({
  title: 'Test Form Data',
  type: JsonScenario,
}) {
  @Scenario({
    uri: 'POST https://postman-echo.com/post',
    data: Form({
      foo: 'bar',
      file: fs.createReadStream(FILE_PATH),
    }),
  })
  async postForm(context: JsonContext) {
    context.debug(context.document);
  }
}
