import { Server, json, file } from 'minikin';
import Project from '../models/project';
import { findSuites } from '../utils/find-suites';

export const startServer = async (project: Project) => {
  const server = await Server.listen();
  const port = server.port;

  server.routes({
    'GET /': () => file(`./public/index.html`),
    'GET /*.html': req => file(`./public/${req.url}`),
    'GET /*.css': req => file(`./public/${req.url}`),
    'GET /*.js': req => file(`./public/${req.url}`),
    'GET /api/suites': () => {
      const suites = findSuites(project);
      return json(
        suites.suiteClasses.map(suite => ({
          name: suite.className,
          fullPath: suite.fullPath,
          relativePath: suite.relativePath,
          fileName: suite.fileName,
        })),
      );
    },
  });

  return {
    port,
    stop: () => server.close(),
  };
};
