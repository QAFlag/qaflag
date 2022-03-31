class Cli {
  public readonly version: string;
  public readonly lineLength = 68;

  public constructor() {
    const pkg = require('../package.json');
    this.version = pkg.version;
  }
}

export default new Cli();
