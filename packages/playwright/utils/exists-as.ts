interface ExistsAsProvider {
  as(newName: string): this;
  exists(): typeof this;
}

export async function existsAs<T extends ExistsAsProvider>(
  value: T,
  name: string,
): Promise<T> {
  const renamed = value.as(name);
  return renamed.exists();
}
