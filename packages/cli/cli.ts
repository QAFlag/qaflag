class Cli {
  public readonly version: string;
  public readonly lineLength = 100;

  public constructor() {
    const pkg = require('../package.json');
    this.version = pkg.version;
  }
}

export default new Cli();
