import { ValueInterface } from '../../value/value.interface';

export const isValueInterface = (x: any): x is ValueInterface => {
  return x['$'] !== undefined && x['context'] && x['name'];
};
