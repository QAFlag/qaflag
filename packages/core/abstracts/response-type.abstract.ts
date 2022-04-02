import { MessageType } from '../models/message';
import { HttpResponse } from '../models/http-response';
import { NumericValue, StringValue } from '../models/values';
import { ResponseInterface } from '../types/response.interface';
import { ScenarioInterface } from '../types/scenario.interface';

export abstract class ResponseType implements ResponseInterface {
  constructor(
    public readonly httpResponse: HttpResponse,
    public readonly scenario: ScenarioInterface,
  ) {}

  public get statusCode(): NumericValue {
    return new NumericValue(this.httpResponse.status.code, {
      name: 'HTTP Status Code',
      logger: this,
    });
  }

  public log(type: MessageType, text: string) {
    return this.scenario.log(type, text);
  }

  public header(name: string) {
    const header = Object.entries(this.httpResponse.headers).find(
      ([key]) => key.toLocaleLowerCase() == name.toLocaleLowerCase(),
    );
    return new StringValue(header ? header[1] : undefined, {
      name: `HTTP Header: ${name}`,
      logger: this,
    });
  }
}
