import { BooleanValue } from '@qaflag/core';
import { HtmlContext } from './html.context';

const htmlHasRequiredTags = (res: HtmlContext): boolean => {
  // Must be one channel and one rss tag
  const html = res.cheerio('html');
  const head = html.children('head');
  const body = html.children('body');
  if (html.length !== 1 || head.length != 1 || body.length != 1) {
    return false;
  }
  return true;
};

export const isHtmlValid = (context: HtmlContext) => {
  return new BooleanValue(htmlHasRequiredTags(context), {
    name: 'HTML Document',
    context,
  });
};
