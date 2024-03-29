import path = require('path');
import * as fs from 'fs-extra';
import { ProjectSettings } from '@qaflag/core';
import { ensurePathsExist } from '../actions/init';

interface ProjectOpts {
  configFile?: string;
}

type PackageConfig = { name: string };

export default class Project {
  public readonly configPath: string;
  public readonly packagePath: string;
  public readonly settings: ProjectSettings;
  public readonly package: PackageConfig;

  constructor(opts: ProjectOpts) {
    this.configPath = path.resolve(
      process.cwd(),
      opts.configFile || 'qaflag.json',
    );
    this.packagePath = path.resolve(process.cwd(), 'package.json');
    const initial: Partial<ProjectSettings> = (() => {
      if (this.isConfigFile) {
        const fileContents = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(fileContents);
      }
      return {};
    })();
    this.package = (() => {
      const defaultPkg = {
        name: 'My Project',
      };
      if (fs.existsSync(this.packagePath)) {
        const fileContents = fs.readFileSync(this.packagePath, 'utf8');
        return {
          ...defaultPkg,
          ...JSON.parse(fileContents),
        };
      }
      return defaultPkg;
    })();
    this.settings = {
      baseUrl:
        process.env.QAFLAG_BASE_URL ||
        initial.baseUrl ||
        'http://localhost:3000',
      theme: initial.theme || 'dark',
      tsConfigPath: initial.tsConfigPath || './qaflag.tsconfig.json',
      screenshotPath: initial.screenshotPath || './screenshots',
      input: {
        path: initial.input?.path || './src',
        pattern: initial.input?.pattern || '**/*.suite.ts',
      },
      output: {
        path: initial.output?.path || './tests',
        pattern: initial.output?.pattern || '**/*.suite.js',
      },
    };
    ensurePathsExist(this.settings);
  }

  public get isConfigFile(): boolean {
    return fs.existsSync(this.configPath);
  }

  public write() {
    fs.writeFileSync(this.configPath, JSON.stringify(this.settings, null, 2));
    fs.writeFileSync(
      this.settings.tsConfigPath,
      JSON.stringify(
        {
          compilerOptions: {
            module: 'commonjs',
            target: 'es6',
            lib: ['es7'],
            rootDir: this.settings.input.path,
            outDir: this.settings.output.path,
            allowJs: true,
            removeComments: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
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
