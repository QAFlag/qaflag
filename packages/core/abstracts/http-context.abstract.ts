import { NumericValue, StringValue } from '../models/values';
import { ContextInterface } from '../types/context.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { HttpResponseInterface } from '../types/http-response.interface';
import { Context } from './context.abstract';

export abstract class HttpContext extends Context implements ContextInterface {
  constructor(
    public readonly scenario: ScenarioInterface,
    protected readonly response: HttpResponseInterface,
  ) {
    super(scenario);
  }

  public get statusCode(): NumericValue {
    return new NumericValue(this.response.status.code, {
      name: 'HTTP Status Code',
      logger: this,
    });
  }

  public header(name: string) {
    const header = Object.entries(this.response.headers).find(
      ([key]) => key.toLocaleLowerCase() == name.toLocaleLowerCase(),
    );
    return new StringValue(header ? header[1] : undefined, {
      name: `HTTP Header: ${name}`,
      logger: this,
    });
  }

  public get requestDuration() {
    return new NumericValue(this.response.duration, {
      name: 'Request Duration',
      logger: this,
    });
  }
}
