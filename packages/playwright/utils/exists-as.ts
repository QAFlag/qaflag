import { PlaywrightValue } from '../models/playwright.value';

export async function existsAs<T extends PlaywrightValue>(
  value: T,
  name: string,
): Promise<T> {
  const renamed = value.as(name);
  await renamed.must.exist();
  return renamed;
}
