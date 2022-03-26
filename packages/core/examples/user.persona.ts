import { Persona } from '../common/models/persona';

export const StandardUserPersona = new Persona({
  name: 'John Doe',
  story: 'John is a registered user, aged 37 and living in Orlando, FL.',
  bearerToken: {
    uri: 'POST /auth',
    jsonBody: {
      email: 'foo@foo.com',
      password: 'bar',
    },
    then: async response => String((response.jsonBody as any).token),
  },
});
