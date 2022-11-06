import FormData = require('form-data');
import * as stream from 'stream';

interface FormOptions {
  highWaterMark?: number;
  encoding?: string;
  objectMode?: boolean;
  read?(this: stream.Readable, size: number): void;
  destroy?(
    this: stream.Readable,
    error: Error | null,
    callback: (error: Error | null) => void,
  ): void;
  autoDestroy?: boolean;
  writable?: boolean;
  readable?: boolean;
  dataSize?: number;
  maxDataSize?: number;
  pauseStreams?: boolean;
}

export const Form = (
  data: Record<string, any>,
  opts?: FormOptions,
): FormData => {
  const formData = new FormData(opts);
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};
