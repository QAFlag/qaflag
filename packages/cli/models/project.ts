import path = require('path');
import fs = require('fs');
import { ProjectInterface } from '../types/project.interface';

interface ProjectOpts {
  configFile?: string;
}

export default class Project implements ProjectInterface {
  private readonly configFile: string | null = null;
  private readonly settings: ProjectInterface | null = null;

  public get isInitialized(): boolean {
    return this.settings !== null;
  }

  public get input() {
    return {
      path: this.settings?.input?.path || './src',
      pattern: this.settings?.input?.pattern || `**/*.suite.ts`,
    };
  }

  public get output() {
    return {
      path: this.settings?.output?.path || './qaflag/suites',
      pattern: this.settings?.output?.pattern || `\.suite\.js`,
    };
  }

  constructor(opts: ProjectOpts) {
    this.configFile = path.resolve(
      process.cwd(),
      opts.configFile || 'qaflag.json',
    );
    if (fs.existsSync(this.configFile)) {
      const fileContents = fs.readFileSync(this.configFile, 'utf8');
      this.settings = JSON.parse(fileContents);
    }
  }

  public serialize(): ProjectInterface {
    return {
      input: this.input,
      output: this.output,
    };
  }

  public write() {
    if (!this.configFile) return;
    fs.writeFileSync(
      this.configFile,
      JSON.stringify(this.serialize(), null, 2),
    );
    fs.writeFileSync(
      './qaflag.tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            module: 'commonjs',
            target: 'es6',
            rootDir: this.input.path,
            outDir: this.output.path,
            allowJs: true,
            removeComments: true,
            experimentalDecorators: true,
          },
          include: [`${this.input.path}/${this.input.pattern}`],
          exclude: ['node_modules', '**/*.spec.ts'],
        },
        null,
        2,
      ),
    );
  }
}
