interface AsProvider {
  as(newName: string): this;
}

export const as = <T extends AsProvider>(value: T, name: string): T =>
  value.as(name);
