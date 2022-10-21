import { ValueInterface } from '@qaflag/core';

export async function as<T extends ValueInterface>(
  value: Promise<T> | T,
  name: string,
): Promise<T> {
  const awaitedValue = await value;
  return awaitedValue.as(name);
}
