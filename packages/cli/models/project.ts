import path = require('path');
import fs = require('fs');
import { ProjectInterface, ProjectTests } from '../types/project.interface';

interface ProjectOpts {
  configFile?: string;
}

export default class Project implements ProjectInterface {
  private readonly configFile: string | null = null;
  private readonly settings: ProjectInterface | null = null;

  public get isInitialized(): boolean {
    return this.settings !== null;
  }

  public tests: ProjectTests = {
    path: ['dist'],
    pattern: [`\.suite\.js`],
  };

  constructor(private readonly opts: ProjectOpts) {
    this.configFile = path.resolve(process.cwd(), 'qaflag.json');
    if (fs.existsSync(this.configFile)) {
      const fileContents = fs.readFileSync(this.configFile, 'utf8');
      this.settings = JSON.parse(fileContents);
    }
  }

  public serialize(): ProjectInterface {
    return {
      tests: this.tests,
    };
  }

  public write() {
    fs.writeFileSync(
      this.configFile,
      JSON.stringify(this.serialize(), null, 2),
    );
  }
}
