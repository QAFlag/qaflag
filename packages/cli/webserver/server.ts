import minikin, { Response } from 'minikin';

export const startServer = async () => {
  const server = await minikin.server();
  const port = server.port;

  server.route('GET /', () => Response.fromFile(`./index.html`));

  console.log(process.argv[1]);
  console.log(__dirname);
  console.log(process.cwd());
  console.log(require.main?.path);

  return {
    port,
    stop: () => server.close(),
  };
};
