import { PersonaInitOpts, PersonaInterface } from '../types/persona.interface';

export class Persona implements PersonaInterface {
  constructor(private readonly opts: PersonaInitOpts) {}

  public get name() {
    return this.opts.name;
  }

  public get story() {
    return this.opts.story;
  }
}
