import { MessageType } from '../models/message';
import { NumericValue, StringValue } from '../models/values';
import { ResponseInterface } from '../types/response.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ValueInterface } from '../types/value.interface';
import { HttpResponseInterface } from '../types/http-response.interface';

export abstract class ResponseType implements ResponseInterface {
  constructor(
    public readonly httpResponse: HttpResponseInterface,
    public readonly scenario: ScenarioInterface,
  ) {}

  public get statusCode(): NumericValue {
    return new NumericValue(this.httpResponse.status.code, {
      name: 'HTTP Status Code',
      logger: this,
    });
  }

  public debug(...messages: (string | number | boolean | ValueInterface)[]) {
    messages.forEach(message => {
      const text = (() => {
        if (
          typeof message == 'string' ||
          typeof message == 'number' ||
          typeof message == 'boolean'
        ) {
          return String(message);
        }
        return message.string.$;
      })();
      this.scenario.log('info', text);
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

  public get requestDuration() {
    return new NumericValue(this.httpResponse.duration, {
      name: 'Request Duration',
      logger: this,
    });
  }
}
