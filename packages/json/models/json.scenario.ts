import { ClassConstructor, ScenarioType } from '@qaflag/core';
import { JsonAdapter } from './json.adapter';
import { JsonRequest } from './json.request';
import { JsonResponse } from './json.response';

type SchemaOpts =
  | string
  | ClassConstructor<unknown>
  | {
      name: string | ClassConstructor<unknown>;
      type?: string;
    };

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
      const schema = this.parseSchema(this.opts.schema);
      if (typeof schema.name == 'string') {
        if (schema.type == 'jtd') {
          this.#response.document.must.match.jtd(schema.name);
        } else if (schema.type == 'jsonschema') {
          this.#response.document.must.match.jsonSchema(schema.name);
        }
      } else {
        this.#response.document.must.match.dto(schema.name);
      }
    }
  }

  private parseSchema(schema: SchemaOpts) {
    if (typeof schema == 'object') {
      return {
        name: schema.name,
        type:
          schema.type.toLowerCase() ||
          (typeof schema == 'string' ? 'jsonschema' : 'dto'),
      };
    }
    return {
      name: schema,
      type: typeof schema == 'string' ? 'jsonschema' : 'dto',
    };
  }
}
