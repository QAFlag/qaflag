import { PlaywrightValue } from '../models/playwright.value';

export async function as<T extends PlaywrightValue>(
  value: Promise<T> | T,
  name: string,
): Promise<T> {
  const awaitedValue = await value;
  return awaitedValue.as(name);
}
