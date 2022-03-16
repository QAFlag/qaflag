import { ScenarioType } from '../common/mixin/scenario-type.mixin';
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
    this.log('info', `Fetched response with status code ${resp.statusCode}`);
    this.#response = new JsonResponse(resp, this);
  }
}
