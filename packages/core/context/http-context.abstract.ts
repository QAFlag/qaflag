import { NumericValue, StringValue } from '../value/values';
import { ContextInterface } from './context.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';
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
      context: this,
    });
  }

  public header(name: string) {
    const header = this.response.headers.find(
      ({ key }) => key.toLocaleLowerCase() == name.toLocaleLowerCase(),
    );
    return new StringValue(header ? header.value : '', {
      name: `HTTP Header: ${name}`,
      context: this,
    });
  }

  public get requestDuration() {
    return new NumericValue(this.response.duration, {
      name: 'Request Duration',
      context: this,
    });
  }
}
