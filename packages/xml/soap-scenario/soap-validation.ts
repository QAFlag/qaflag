import { BooleanValue } from '@qaflag/core';
import { SoapContext } from './soap.context';

const hasRequiredSoapFields = (res: SoapContext): boolean => {
  const root = res.cheerio.root().children()[0];
  const rootName: string = root['name'];
  const rootParts = rootName.split(':');
  const prefix = rootParts.length == 1 ? null : rootParts[0];
  const envTag = prefix === null ? 'Envelope' : `${prefix}\\:Envelope`;
  const bodyTag = prefix === null ? 'Body' : `${prefix}\\:Body`;
  // Root element must be envelope
  if (rootParts.length == 0 || rootParts.length > 2 || rootName == envTag) {
    res.log('fail', `Root element is <${envTag}>`);
    return false;
  }
  // Must be one envelope
  const envelope = res.cheerio(envTag);
  if (envelope.length !== 1) {
    res.log('fail', `Found envelope tag <${envTag}>`);
    return false;
  }
  // Envelope must have body
  const body = envelope.children(bodyTag);
  if (body.length !== 1) {
    res.log('fail', `<${envTag}> contains child <${bodyTag}>`);
    return false;
  }
  // Made it this far? Valid;
  return true;
};

export const isSoapValid = (res: SoapContext) => {
  return new BooleanValue(hasRequiredSoapFields(res), {
    name: 'SOAP Document',
    logger: res,
  });
};
