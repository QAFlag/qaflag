import { NumberMapValue } from '@qaflag/core';
import { ValueDevice } from './value-device';

export class ImageElement extends ValueDevice {
  public async natrualSize(): Promise<
    NumberMapValue<{ width: number; height: number }>
  > {
    const size = await this.locator.evaluate((element: HTMLImageElement) => [
      element.naturalWidth,
      element.naturalHeight,
    ]);
    return new NumberMapValue(
      { width: size[0], height: size[1] },
      {
        name: `Natural Size of ${this.input.name}`,
        context: this.context,
      },
    );
  }

  public async size(): Promise<
    NumberMapValue<{ width: number; height: number }>
  > {
    const size = await this.locator.evaluate((element: HTMLImageElement) => [
      element.offsetWidth,
      element.offsetHeight,
    ]);
    return new NumberMapValue(
      { width: size[0], height: size[1] },
      {
        name: `Display Size of ${this.input.name}`,
        context: this.context,
      },
    );
  }
}
