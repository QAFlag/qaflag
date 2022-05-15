import { HttpResponse } from '@qaflag/core';
import { XmlRequest } from '../xml-scenario/xml.request';
import { XmlContext } from '../xml-scenario/xml.context';
import { isValidAtomFeed } from './atom-validation';
import { AtomScenario } from './atom.scenario';

const validMimeTypes = ['application/atom+xml', 'text/xml', 'text/atom+xml'];

export class AtomContext extends XmlContext<AtomScenario> {
  constructor(
    public readonly scenario: AtomScenario,
    protected readonly response: HttpResponse<string, XmlRequest>,
  ) {
    super(scenario, response);
    this.header('content-type').must.startWith(validMimeTypes);
    isValidAtomFeed(this).as('Is valid Atom Feed?').must.be.true();
  }

  public get feed() {
    return this.find('feed');
  }

  public get feedId() {
    return this.find('feed id');
  }

  public get feedTitle() {
    return this.find('feed title');
  }

  public get entries() {
    return this.find('feed entry').array.as('Entries');
  }
}
