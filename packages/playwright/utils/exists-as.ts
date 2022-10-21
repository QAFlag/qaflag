import { ValueInterface } from '@qaflag/core';

export async function existsAs<T extends ValueInterface>(
  value: T,
  name: string,
): Promise<T> {
  const renamed = value.as(name);
  await renamed.must.exist();
  return renamed;
}
