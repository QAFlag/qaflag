import { PersonaInitOptions } from './persona.interface';

export const Demographic = (
  gender: 'male' | 'female' | 'nonbinary' | undefined,
  age: number,
): PersonaInitOptions => ({
  gender,
  age,
});
