export type Find = {
  selector: string;
  name: string;
};

export type SelectorOpts = Record<string, string | number | boolean>;

export type SelectRelative = (
  selectorA: string | Find,
  selectorB: string | Find,
  opts?: SelectorOpts,
) => Find;

export type SelectModifier = (selector: string | Find) => Find;

export type SelectWrapper = (selector: string) => Find;

const handleOverloading = (...elements: Array<string | Find>): Find[] => {
  return elements.map(el => ({
    selector: typeof el == 'string' ? el : el.selector,
    name: typeof el == 'string' ? el : el.name,
  }));
};

export const xpath: SelectWrapper = (selector: string) => ({
  selector: `xpath=${selector}`,
  name: selector,
});

export const text: SelectWrapper = (selector: string) => ({
  selector: `text=${selector}`,
  name: selector,
});

export const alt: SelectWrapper = (value: string) => ({
  selector: `[alt=${value}]`,
  name: `alt=${value}`,
});

export const placeholder: SelectWrapper = (value: string) => ({
  selector: `[placeholder=${value}]`,
  name: `placeholder=${value}`,
});

export const title: SelectWrapper = (value: string) => ({
  selector: `[title=${value}]`,
  name: `title=${value}`,
});

export const visible: SelectModifier = (select: string | Find) => {
  const [element] = handleOverloading(select);
  return {
    selector: `${element.selector} >> visible=true`,
    name: `${element.name} (Visible)`,
  };
};

export const having: SelectRelative = (
  selectingElement: string | Find,
  thatHas: string | Find,
) => {
  const [a, b] = handleOverloading(selectingElement, thatHas);
  return {
    selector: `${a.selector} >> ${b.selector}`,
    name: `${a.name} having ${b.name}"`,
  };
};

export const hasChild: SelectRelative = (
  selectingElement: string | Find,
  thatHas: string | Find,
) => {
  const [a, b] = handleOverloading(selectingElement, thatHas);
  return {
    selector: `${a.selector}:has(${b.selector})`,
    name: `${a.name} having child ${b.name}"`,
  };
};

export const passthrough: SelectModifier = (selector: string | Find) => {
  const [a] = handleOverloading(selector);
  return a;
};

export const near: SelectRelative = (
  selectThis: string | Find,
  nearThat: string | Find,
  opts?: { max: number },
) => {
  const [a, b] = handleOverloading(selectThis, nearThat);
  return {
    selector: `${a.selector}:near(${b.selector}, ${opts?.max || 50})`,
    name: `${a.name} near ${b.name}`,
  };
};

export const leftOf: SelectRelative = (
  selectThis: string,
  nearThat: string,
) => {
  const [a, b] = handleOverloading(selectThis, nearThat);
  return {
    selector: `${a.selector}:left-of(${b.selector})`,
    name: `${a.name} left of ${b.name}`,
  };
};

export const rightOf: SelectRelative = (
  selectThis: string,
  nearThat: string,
) => {
  const [a, b] = handleOverloading(selectThis, nearThat);
  return {
    selector: `${a.selector}:right-of(${b.selector})`,
    name: `${a.name} right of ${b.name}`,
  };
};

export const above: SelectRelative = (selectThis: string, nearThat: string) => {
  const [a, b] = handleOverloading(selectThis, nearThat);
  return {
    selector: `${a.selector}:above(${b.selector})`,
    name: `${a.name} above ${b.name}`,
  };
};

export const below: SelectRelative = (selectThis: string, nearThat: string) => {
  const [a, b] = handleOverloading(selectThis, nearThat);
  return {
    selector: `${a.selector}:below(${b.selector})`,
    name: `${a.name} below ${b.name}`,
  };
};

export const getSelectorFromOverload = (
  argA: string | Find | SelectModifier,
  argB?: SelectRelative | string | Find,
  argC?: string | Find,
  opts?: SelectorOpts,
): Find => {
  if (typeof argA !== 'function' && typeof argB === 'function' && argC) {
    return argB(argA, argC, opts);
  }
  if (typeof argA == 'function' && argB && typeof argB != 'function') {
    return argA(argB);
  }
  if (typeof argA === 'string') return passthrough(argA);
  if (typeof argA === 'function') throw 'Invalid find options';
  return argA;
};
