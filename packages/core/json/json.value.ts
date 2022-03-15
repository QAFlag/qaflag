import { ValueType } from '../common/mixin/value.mixin';
import { JsonData } from '../common/types/general.types';

export class JsonValue extends ValueType({ name: 'JSON Value' })<JsonData> {}
