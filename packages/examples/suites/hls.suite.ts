import { Scenario, Suite } from '@qaflag/core';
import { HlsScenario, HlsContext } from '@qaflag/hls';

export class HlsSuite extends Suite({
  title: 'Test HLS Stream',
  type: HlsScenario,
}) {
  @Scenario({
    uri: 'GET "https://content.jwplatform.com/manifests/yp34SRmf.m3u8',
  })
  async getMasterManifest(context: HlsContext) {}
}
