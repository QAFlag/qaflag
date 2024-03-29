import { KeyValue } from '../types/general.types';

export class KvStore {
  #store: KeyValue = {};

  public entries() {
    return Object.entries(this.#store);
  }

  public keys() {
    return Object.keys(this.#store);
  }

  public values() {
    return Object.values(this.#store);
  }

  public set<T>(key: string, value: T): T {
    this.#store[key] = value;
    return value;
  }

  public get<T = any>(key: string): T {
    return this.#store[key] as T;
  }

  public push<T = any>(key: string, value: T): T[] {
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
