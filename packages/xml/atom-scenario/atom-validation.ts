import { BooleanValue } from '@qaflag/core';
import { AtomContext } from './atom.context';

const hasRequiredAtomFields = (res: AtomContext): boolean => {
  // Must be one channel and one rss tag
  const feed = res.cheerio('feed');
  if (feed.length !== 1) {
    return false;
  }
  // Channel must have title, link and description
  const channelId = feed.children('id');
  const channelTitle = feed.children('title');
  const channelUpdated = feed.children('updated');
  if (
    channelId.length !== 1 ||
    channelTitle.length != 1 ||
    channelUpdated.length != 1
  ) {
    return false;
  }
  // Check items
  const entries = feed.children('entry');
  if (entries.length > 0) {
    let allItemsAreValid: boolean = true;
    entries.each((i, entry) => {
      const id = res.cheerio(entry).children('id');
      const title = res.cheerio(entry).children('title');
      const updated = res.cheerio(entry).children('updated');
      if (id.length !== 1 || title.length !== 1 || updated.length !== 1) {
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

export const isValidAtomFeed = (context: AtomContext): BooleanValue => {
  return new BooleanValue(hasRequiredAtomFields(context), {
    name: 'Atom Document',
    context,
  });
};
