import path = require('path');
import fs = require('fs');
import { ProjectInterface } from '../types/project.interface';

interface ProjectOpts {
  configFile?: string;
}

export default class Project {
  public readonly configPath: string;
  public readonly settings: ProjectInterface;

  constructor(opts: ProjectOpts) {
    this.configPath = path.resolve(
      process.cwd(),
      opts.configFile || 'qaflag.json',
    );
    const initial: Partial<ProjectInterface> = (() => {
      if (this.isConfigFile) {
        const fileContents = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(fileContents);
      }
      return {};
    })();
    this.settings = {
      defaultDomain:
        process.env.QAFLAG_DEFAULT_DOMAIN ||
        initial.defaultDomain ||
        'http://localhost:3000',
      input: {
        path: initial.input?.path || './src',
        pattern: initial.input?.pattern || '**/*.suite.ts',
      },
      output: {
        path: initial.output?.path || './qaflag',
        pattern: initial.output?.pattern || '**/*.suite.js',
      },
    };
  }

  public get isConfigFile(): boolean {
    return fs.existsSync(this.configPath);
  }

  public write() {
    fs.writeFileSync(this.configPath, JSON.stringify(this.settings, null, 2));
    fs.writeFileSync(
      './qaflag.tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            module: 'commonjs',
            target: 'es6',
            rootDir: this.settings.input.path,
            outDir: this.settings.output.path,
            allowJs: true,
            removeComments: true,
            experimentalDecorators: true,
          },
          include: [
            `${this.settings.input.path}/${this.settings.input.pattern}`,
          ],
          exclude: ['node_modules', '**/*.spec.ts'],
        },
        null,
        2,
      ),
    );
  }
}
