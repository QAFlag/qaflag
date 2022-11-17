import Server, { file } from 'minikin';

export const initMinikin = async () => {
  const minikin = await Server(8080);

  minikin.route('GET /aria', () =>
    file('./packages/examples/fixtures/aria.html'),
  );
  minikin.route('*', () => 'Hello from Minikin!');

  return minikin;
};
