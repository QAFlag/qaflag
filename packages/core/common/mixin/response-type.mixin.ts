import { HttpResponse } from '../models/http-response';
import { NumericValue } from '../models/value';
import { MessageInterface } from '../types/message.interface';
import { ResponseInterface } from '../types/response.interface';
import { ScenarioInterface } from '../types/scenario.interface';

interface ResponseTypeOpts {
  name: string;
}

export function ResponseType(initOpts: ResponseTypeOpts) {
  abstract class ResponseAbstract implements ResponseInterface {
    constructor(
      public readonly httpResponse: HttpResponse,
      public readonly scenario: ScenarioInterface,
    ) {}

    public get statusCode(): NumericValue {
      return new NumericValue(this.httpResponse.statusCode, {
        name: 'HTTP Status Code',
      });
    }

    public log(messages: MessageInterface | MessageInterface[]): void {
      this.scenario.log(messages);
    }
  }
  return ResponseAbstract;
}
