import { LogReceiver } from './log-provider.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  logger: LogReceiver;
}
