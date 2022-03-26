import { Persona } from '../common/models/persona';

export const GuestPersona = new Persona({
  name: 'Guest User',
  story:
    'I am a new user who has landed on the site for the first time from Google. I have not yet created an account.',
  headers: {
    'X-API-Key': 'foobar',
  },
  auth: {
    type: 'basic',
    username: 'me',
    password: 'whatever',
  },
});
