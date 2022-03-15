import { ResponseType } from '../common/mixin/response-type.mixin';
import { JsonValue } from './json.value';

export class JsonResponse extends ResponseType({
  name: 'JSON Response',
}) {
  public find(selector: string) {
    return new JsonValue('foo', { name: selector });
  }
}
