import { PersonaInitOptions } from './persona.interface';

export const Demographic = (
  gender: 'male' | 'female' | undefined,
  age: number,
): PersonaInitOptions => ({
  gender,
  age,
});
