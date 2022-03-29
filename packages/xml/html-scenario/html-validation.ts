import { BooleanValue } from '@qaflag/core';
import { HtmlResponse } from './html.response';

const htmlHasRequiredTags = (res: HtmlResponse): boolean => {
  // Must be one channel and one rss tag
  const html = res.cheerio('html');
  const head = html.children('head');
  const body = html.children('body');
  if (html.length !== 1 || head.length != 1 || body.length != 1) {
    return false;
  }
  return true;
};

export const isHtmlValid = (res: HtmlResponse) => {
  return new BooleanValue(htmlHasRequiredTags(res), {
    name: 'HTML Document',
    logger: res,
  });
};
