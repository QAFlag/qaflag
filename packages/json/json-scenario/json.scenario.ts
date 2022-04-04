import { ScenarioType } from '@qaflag/core';
import { JsonData } from '../types/json-data';
import { SchemaType, testSchema } from '../utils/ajv';
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
    this.#response = new JsonResponse(resp, this);
    this.#response.statusCode.must.be.equalTo(this.statusCode || 200);
    if (this.opts.schema) {
      const name =
        typeof this.opts.schema == 'object'
          ? this.opts.schema.name
          : this.opts.schema;
      if (typeof name == 'string') {
        const type = (
          typeof this.opts.schema == 'object'
            ? this.opts.schema.type
            : 'JsonSchema'
        ) as SchemaType;
        await this.validateSchema(
          name,
          type == 'JTD' ? 'JTD' : 'JsonSchema',
          resp.data,
        );
      }
    }
  }

  private async validateSchema(name: string, type: SchemaType, data: JsonData) {
    const errors = await testSchema(data, name, type);
    if (errors.length > 0) {
      errors.forEach(error => {
        this.log('fail', error);
      });
    } else {
      this.log('pass', `JSON response matched schema ${name} (${type})`);
    }
  }
}
