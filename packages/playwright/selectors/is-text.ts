export const isText = (selector: string) =>
  /^'.*'$/.test(selector) || /^".*"$/.test(selector);
