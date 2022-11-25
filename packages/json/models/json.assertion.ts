import { ClassConstructor, Test } from '@qaflag/core';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { testSchema } from '../utils/ajv';
import { JsonValue } from './json.value';

export class JsonAssertion extends Test<JsonValue> {
  public async dto<T>(className: ClassConstructor<T>, opts?: ValidatorOptions) {
    const instance = plainToClass(className, this.input.$);
    const errors = await validate(instance as unknown as object, opts);
    const result = this.result(
      this.assertion.execute(() => errors.length == 0),
      `DTO ${className.name}`,
    );
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
    return result;
  }

  public async jtd(name: string) {
    const errors = await testSchema(this.input.$, name, 'JTD');
    const result = this.result(
      this.assertion.execute(() => errors.length == 0),
      `JTD ${name}`,
    );
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
    return result;
  }

  public async jsonSchema(name: string) {
    const errors = await testSchema(this.input.$, name, 'JsonSchema');
    const result = this.result(
      this.assertion.execute(() => errors.length == 0),
      `JsonSchema ${name}`,
    );
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
    return result;
  }
}
