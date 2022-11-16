import is from '@sindresorhus/is';

export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> | undefined }
  : T | undefined;

export const humanReadableList = (
  array: unknown[],
  join: ',' | ';' = ',',
  finalJoin = 'and',
): string => {
  if (!Array.isArray(array) || array.length == 0) return '';
  if (array.length == 1) return String(array[0]);
  const arr = array.slice(0),
    last = arr.pop();
  return array.length > 2
    ? arr.join(`${join} `) + `${join} ${finalJoin} ${last}`
    : `${array[0]} ${finalJoin} ${last}`;
};

export const deepMerge = <T extends object = Record<string, any>>(
  target: T,
  ...sources: object[]
): T => {
  const merge = (target: object, source: object) => {
    Object.keys(source).forEach((key: string) => {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (is.object(targetValue) && is.object(sourceValue)) {
        target[key] = merge(Object.assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });
    return target;
  };
  return sources.reduce((prev, cur) => merge(prev, cur), target) as T;
};

export const shallowMerge = <T extends object = Record<string, any>>(
  target: T,
  ...sources: object[]
): T => {
  const merge = (target: object, source: object) => {
    Object.keys(source).forEach((key: string) => {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });
    return target;
  };
  return sources.reduce((prev, cur) => merge(prev, cur), target) as T;
};

export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const ucfirst = (str: string) =>
  str
    .split(' ')
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
