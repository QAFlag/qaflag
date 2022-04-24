class Subscription<Payload> {
  public callback: (payload: Payload) => void = () => {};
  public count: number = 0;
  public limit: number | null;
  public then(callback: (payload: Payload) => void) {
    this.callback = callback;
  }
  constructor(limit: number | null) {
    this.limit = limit;
  }
}

export class PubSub<Events extends { [eventName: string]: unknown }> {
  public _subscribers: {
    [eventName: string]: Subscription<unknown>[];
  } = {};

  public on<Key extends keyof Events>(eventName: Key) {
    if (!this._subscribers[eventName as string]) {
      this._subscribers[eventName as string] = [];
    }
    const subscription = new Subscription<Events[Key]>(null);
    this._subscribers[eventName as string].push(subscription);
    return subscription;
  }

  public once<Key extends keyof Events>(eventName: Key) {
    if (!this._subscribers[eventName as string]) {
      this._subscribers[eventName as string] = [];
    }
    const subscription = new Subscription<Events[Key]>(1);
    this._subscribers[eventName as string].push(subscription);
    return subscription;
  }

  public emit<Key extends keyof Events>(eventName: Key, payload?: Events[Key]) {
    if (this._subscribers[eventName as string]) {
      this._subscribers[eventName as string].forEach(subscription => {
        if (subscription.count < subscription.count) {
          subscription.count++;
          subscription.callback(payload);
        }
      });
    }
  }
}
