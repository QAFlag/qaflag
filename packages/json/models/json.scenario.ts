import { ClassConstructor, ScenarioType } from '@qaflag/core';
import { JsonAdapter } from './json.adapter';
import { JsonRequest } from './json.request';
import { JsonContext } from './json.context';

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
  #context: JsonContext | null = null;
  #adapter: JsonAdapter = new JsonAdapter();

  public readonly request = new JsonRequest(this.opts, this.persona);

  public get context(): JsonContext | null {
    return this.#context;
  }

  public async execute() {
    const resp = await this.#adapter.fetch(this.request);
    this.#context = new JsonContext(this, resp);
    this.#context.statusCode.must.be.equalTo(this.statusCode || 200);
    if (this.opts.schema) {
      const schema = this.parseSchema(this.opts.schema);
      if (typeof schema.name == 'string') {
        if (schema.type == 'jtd') {
          this.#context.document.must.match.jtd(schema.name);
        } else if (schema.type == 'jsonschema') {
          this.#context.document.must.match.jsonSchema(schema.name);
        }
      } else {
        this.#context.document.must.match.dto(schema.name);
      }
    }
  }

  private parseSchema(schema: SchemaOpts) {
    if (typeof schema == 'object') {
      return {
        name: schema.name,
        type:
          schema.type?.toLowerCase() ||
          (typeof schema == 'string' ? 'jsonschema' : 'dto'),
      };
    }
    return {
      name: schema,
      type: typeof schema == 'string' ? 'jsonschema' : 'dto',
    };
  }
}
