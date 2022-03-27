import { HttpResponse } from '../common/models/http-response';
import { Persona } from '../common/models/persona';

export const StandardUserPersona = new Persona({
  name: 'John Doe',
  story: 'John is a registered user, aged 37 and living in Orlando, FL.',
  bearerToken: {
    uri: 'POST /auth',
    data: {
      email: 'foo@foo.com',
      password: 'bar',
    },
    parse: async (response: HttpResponse) =>
      String((response.data as any).token),
  },
});
