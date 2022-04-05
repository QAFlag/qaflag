import { ClassConstructor, mustOrShould, Test } from '@qaflag/core';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { testSchema } from '../utils/ajv';
import { JsonData } from '../types/json-data';
import { JsonValue } from './json.value';

export class JsonAssertion extends Test<JsonData> {
  constructor(input: JsonValue, type: mustOrShould) {
    super(input, type);
  }

  public async dto<T>(className: ClassConstructor<T>, opts?: ValidatorOptions) {
    const instance = plainToClass(className, this.input.$);
    const errors = await validate(instance as unknown as object, opts);
    this.message.push(`DTO ${className.name}`);
    this.execute(() => errors.length == 0);
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
  }

  public async jtd(name: string) {
    this.message.push(`JTD ${name}`);
    const errors = await testSchema(this.input.$, name, 'JTD');
    this.execute(() => errors.length == 0);
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
  }

  public async jsonSchema(name: string) {
    this.message.push(`JsonSchema ${name}`);
    const errors = await testSchema(this.input.$, name, 'JsonSchema');
    this.execute(() => errors.length == 0);
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
  }
}
