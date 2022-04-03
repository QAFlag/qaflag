import is from '@sindresorhus/is';

export const isArrayOfObjects = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;
  return value.every(item => is.object(item));
};

export const isArrayOfNumbers = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;
  return value.every(item => is.number(item));
};

export const isArrayOfStrings = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;
  return value.every(item => is.string(item));
};

/**
 * Get the real and normalized type of object
 *
 * @param obj
 * @returns {string}
 */
export const toType = (obj: any): string => {
  if (typeof obj === 'undefined') return 'undefined';
  if (obj === null) return 'null';
  if (obj === NaN) return 'nan';
  if (!!obj && obj.cheerio) return 'cheerio';
  if (is.promise(obj)) return 'promise';
  if (is.asyncFunction(obj)) return 'asyncfunction';
  if (obj && obj.constructor && obj.constructor.name) {
    return String(obj.constructor.name).toLocaleLowerCase();
  }
  if (obj && obj.constructor && obj.constructor.toString) {
    const arr = obj.constructor.toString().match(/function\s*(\w+)/);
    if (arr && arr.length == 2) {
      return String(arr[1]).toLocaleLowerCase();
    }
  }
  // This confusing mess gets deep typeof
  const match: RegExpMatchArray | null = {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/);
  return match !== null ? String(match[1]).toLocaleLowerCase() : '';
};
