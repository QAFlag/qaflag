import {
  IteratorBoolCallback,
  IteratorCallback,
} from '../types/iterator.types';

export const asyncFindIndex = async (
  array: any[],
  callback: IteratorBoolCallback,
): Promise<number> => {
  for (let i = 0; i < array.length; i++) {
    if (await callback(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};

export const asyncFind = async <T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<T | null> => {
  for (let i = 0; i < array.length; i++) {
    if (await callback(array[i], i, array)) {
      return array[i];
    }
  }
  return null;
};

export const asyncFindNot = async <T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<T | null> => {
  for (let i = 0; i < array.length; i++) {
    if (!(await callback(array[i], i, array))) {
      return array[i];
    }
  }
  return null;
};

export const asyncUntil = async <T>(
  array: any[],
  callback: IteratorCallback,
): Promise<T | null> => {
  for (let i = 0; i < array.length; i++) {
    const output = await callback(array[i], i, array);
    if (output) {
      return output;
    }
  }
  return null;
};

export const asyncForEach = async <T>(
  array: T[],
  callback: IteratorCallback,
): Promise<void> => {
  await asyncMap(array, callback);
};

export const asyncEvery = async <T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<boolean> => {
  for (const item of array) {
    if (!(await callback(item))) return false;
  }
  return true;
};

export const asyncFilter = async <T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<T[]> => {
  const results = await asyncMap<boolean, T>(array, callback);
  return array.filter((_v, index) => !!results[index]);
};

export const asyncMap = async <T, F = unknown>(
  array: F[],
  callback: IteratorCallback,
): Promise<T[]> => {
  return Promise.all(
    //array.map(async (item, i, arr) => await callback(item, i, arr))
    array.map(callback),
  );
};

export const asyncFlatMap = async <T, F = unknown>(
  array: F[],
  callback: IteratorCallback,
): Promise<T[]> => {
  const values = await asyncMap<T, F>(array, callback);
  return ([] as T[]).concat(...values);
};

export const asyncMapToObject = async <T>(
  array: string[],
  callback: IteratorCallback,
): Promise<{ [key: string]: T }> => {
  const results = await asyncMap<T, string>(array, callback);
  return array.reduce((map, key, i) => {
    map[key] = results[i];
    return map;
  }, {});
};

export async function asyncNone<T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<boolean> {
  return !(await asyncSome(array, callback));
}

export async function asyncSome<T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<boolean> {
  for (const item of array) {
    if (await callback(item)) return true;
  }
  return false;
}

export async function asyncCount<T>(
  array: T[],
  callback: IteratorBoolCallback,
): Promise<number> {
  let n = 0;
  for (const item of array) {
    if (await callback(item)) n++;
  }
  return n;
}

/**
 * Flatten arrays and objects
 */
export const flatten = <T>(items: any[] | { [key: string]: any }): T[] => {
  return ([] as T[]).concat(...Object.values(items));
};
