import { Context, ContextInterface, ScenarioInterface } from '@qaflag/core';
import { PlaywrightInstance } from './playwright.adapter';

export class PlaywrightContext extends Context implements ContextInterface {
  constructor(
    public readonly scenario: ScenarioInterface,
    public readonly playwright: PlaywrightInstance,
  ) {
    super(scenario);
  }
}
