export const extractPrefix = (selector: string) => {
  const matches = selector.match(/^([a-z]+)=(.+)$/i);
  if (!matches) return null;
  return {
    prefix: matches[1],
    selector: matches[2],
  };
};
