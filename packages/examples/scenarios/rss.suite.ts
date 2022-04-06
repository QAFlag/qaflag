import { Scenario, Suite } from '@qaflag/core';
import { RssContext, RssScenario } from '@qaflag/xml';

export class RssCnnSuite extends Suite(RssScenario, {
  title: 'Test CNN RSS Feed',
}) {
  @Scenario({
    uri: 'GET http://rss.cnn.com/rss/cnn_topstories.rss',
    statusCode: 200,
  })
  async getFeed(context: RssContext) {}
}
