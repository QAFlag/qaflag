import { test, ValueAbstract } from '@qaflag/core';
import { Must } from '@qaflag/core';

export interface PagePosition {
  x: number;
  y: number;
}

export interface BoundingBox extends PagePosition {
  width: number;
  height: number;
}

export class BoundingBoxValue extends ValueAbstract<BoundingBox> {
  public get must(): Must<typeof this> {
    return test(this, 'must');
  }

  public get should(): Must<typeof this> {
    return test(this, 'should');
  }

  public get could(): Must<typeof this> {
    return test(this, 'could');
  }

  public get x() {
    return this.createNumber(this.input.x, {
      name: `X-Position of ${this.name}`,
    });
  }

  public get y() {
    return this.createNumber(this.input.y, {
      name: `Y-Position of ${this.name}`,
    });
  }

  public get width() {
    return this.createNumber(this.input.width, {
      name: `Width of ${this.name}`,
    });
  }

  public get height() {
    return this.createNumber(this.input.height, {
      name: `Height of ${this.name}`,
    });
  }

  public get array() {
    return this.createArray([
      this.input.x,
      this.input.y,
      this.input.width,
      this.input.height,
    ]);
  }
}
