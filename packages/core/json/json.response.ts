import * as jmespath from 'jmespath';
import { ResponseType } from '../common/mixin/response-type.mixin';
import { JsonData } from '../common/types/general.types';
import { JsonValue } from './json.value';

export class JsonResponse extends ResponseType({
  name: 'JSON Response',
}) {
  public find(selector: string) {
    const results: JsonData = jmespath.search(this.httpResponse.data, selector);
    return new JsonValue(results, { name: selector, logger: this });
  }
}
