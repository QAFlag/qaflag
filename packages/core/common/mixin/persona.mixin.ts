import { PersonaInitOpts, PersonaInterface } from '../types/persona.interface';

export function Persona(opts: PersonaInitOpts): PersonaInterface {
  return new (class implements PersonaInterface {
    public readonly name = opts.name;
    public readonly story = opts.story;
  })();
}
