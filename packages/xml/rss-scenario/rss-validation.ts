import { BooleanValue } from '@qaflag/core';
import { RssResponse } from './rss.response';

const rssHasRequiredFields = (res: RssResponse): boolean => {
  // Must be one channel and one rss tag
  const rss = res.cheerio('rss');
  const channel = rss.children('channel');
  if (rss.length !== 1 || channel.length != 1) {
    return false;
  }
  // Channel must have title, link and description
  const channelLink = channel.children('link');
  const channelTitle = channel.children('title');
  const channelDesc = channel.children('description');
  if (
    channelLink.length !== 1 ||
    channelTitle.length != 1 ||
    channelDesc.length != 1
  ) {
    return false;
  }
  // Check items
  const items = channel.children('item');
  if (items.length > 0) {
    let allItemsAreValid: boolean = true;
    items.each((i, item) => {
      const itemTitle = res.cheerio(item).children('title');
      const itemDesc = res.cheerio(item).children('description');
      if (itemTitle.length == 0 && itemDesc.length == 0) {
        allItemsAreValid = false;
        return false;
      }
    });
    if (!allItemsAreValid) {
      return false;
    }
  }
  // Made it this far? Valid;
  return true;
};

export const isRssValid = (res: RssResponse) => {
  return new BooleanValue(rssHasRequiredFields(res), {
    name: 'RSS Document',
    logger: res,
  });
};
