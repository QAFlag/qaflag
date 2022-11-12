export const isPrefixed = (selector: string) => /^\*?[a-z]+=/.test(selector);

export const isAlt = (selector: string) => /^alt=/.test(selector);
