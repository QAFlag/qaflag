import { ClassConstructor, mustOrShould, Test } from '@qaflag/core';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { JsonData } from '../types/json-data';
import { JsonValue } from './json.value';

export class JsonTest extends Test<JsonData> {
  constructor(input: JsonValue, type: mustOrShould) {
    super(input, type);
  }

  public async dto<T>(className: ClassConstructor<T>, opts?: ValidatorOptions) {
    const instance = plainToClass(className, this.input.$);
    const errors = await validate(instance as unknown as object, opts);
    this.message.push('DTO');
    this.execute(value => errors.length == 0);
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
  }
}
