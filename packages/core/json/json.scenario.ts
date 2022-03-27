import { ScenarioType } from '../common/mixin/scenario-type.mixin';
import testSchema from '../common/utils/ajv';
import { JsonAdapter } from './json.adapter';
import { JsonRequest } from './json.request';
import { JsonResponse } from './json.response';

export class JsonScenario extends ScenarioType({
  name: 'JSON',
}) {
  #response: JsonResponse | null = null;
  #adapter: JsonAdapter = new JsonAdapter();

  public readonly request = new JsonRequest(this.opts);

  public get response(): JsonResponse | null {
    return this.#response;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.log('info', `Fetched response with status code ${resp.status.code}`);
    if (this.opts.schema) {
      const schemaType = this.opts.schema.type || 'JsonSchema';
      const errors = await testSchema(
        resp.data,
        this.opts.schema.name,
        schemaType,
      );
      if (errors.length > 0) {
        errors.forEach(error => {
          this.log('fail', error);
        });
      } else {
        this.log(
          'pass',
          `JSON response matched schema ${this.opts.schema.name} (${schemaType})`,
        );
      }
    }
    this.#response = new JsonResponse(resp, this);
  }
}
