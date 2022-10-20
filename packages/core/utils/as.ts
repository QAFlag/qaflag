interface AsProvider {
  as(newName: string): this;
}

export async function as<T extends AsProvider>(
  value: Promise<T> | T,
  name: string,
): Promise<T> {
  const awaitedValue = await value;
  return awaitedValue.as(name);
}
