interface AsProvider {
  as(newName: string): this;
}

export const as = async <T extends AsProvider>(
  value: Promise<T>,
  name: string,
): Promise<T> => {
  const awaitedValue = await value;
  return awaitedValue.as(name);
};
