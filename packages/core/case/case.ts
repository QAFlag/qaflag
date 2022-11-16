export interface CaseInitOpts {
  key: string;
  title: string;
  description?: string;
}

export class TestCase {
  public readonly title: string;
  public readonly key: string;
  public readonly description: string | undefined;

  constructor(opts: CaseInitOpts) {
    this.title = opts.title;
    this.key = opts.key;
    this.description = opts.description;
  }
}
