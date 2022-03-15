import { KeyValue } from '../types/general.types';

export class KvStore {
  #store: KeyValue;

  public set(key: string, value: any) {
    this.#store[key] = value;
    return value;
  }

  public get(key: string) {
    return this.#store[key];
  }

  public push(key: string, value: any): any[] {
    const current = this.get(key);
    if (current == undefined) {
      this.set(key, [value]);
    } else if (Array.isArray(current)) {
      this.set(key, current.push(value));
    } else {
      this.set(key, [current].push(value));
    }
    return this.get(key);
  }
}
