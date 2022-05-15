import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../value/values';
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

  protected stringValue(input: string, name: string) {
    return new StringValue(input, {
      name,
      logger: this.logger,
    });
  }

  protected numericValue(input: number, name: string) {
    return new NumericValue(input, {
      name,
      logger: this.logger,
    });
  }

  protected booleanValue(input: boolean, name: string) {
    return new BooleanValue(input, {
      name,
      logger: this.logger,
    });
  }

  protected arrayValue<T>(input: T[], name: string) {
    return new ArrayValue(input, {
      name,
      logger: this.logger,
    });
  }

  public get statusCode(): NumericValue {
    return new NumericValue(this.response.status.code, {
      name: 'HTTP Status Code',
      logger: this.logger,
    });
  }

  public header(name: string) {
    const header = this.response.headers.find(
      ({ key }) => key.toLocaleLowerCase() == name.toLocaleLowerCase(),
    );
    return new StringValue(header ? header.value : '', {
      name: `HTTP Header: ${name}`,
      logger: this.logger,
    });
  }

  public get requestDuration() {
    return new NumericValue(this.response.duration, {
      name: 'Request Duration',
      logger: this.logger,
    });
  }
}
