import { Persona } from '@qaflag/core';

export class GuestPersona extends Persona('Guest User', {
  story:
    'I am a new user who has landed on the site for the first time from Google. I have not yet created an account.',
}) {}
