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
