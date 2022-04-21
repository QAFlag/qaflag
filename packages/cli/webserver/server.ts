import minikin, { Response } from 'minikin';
import Project from '../models/project';
import { findSuites } from '../utils/find-suites';

export const startServer = async (project: Project) => {
  const server = await minikin.server();
  const port = server.port;

  server.routes({
    'GET /': () => Response.fromFile(`./public/index.html`),
    'GET /*.html': req => Response.fromFile(`./public/${req.url}`),
    'GET /*.css': req => Response.fromFile(`./public/${req.url}`),
    'GET /*.js': req => Response.fromFile(`./public/${req.url}`),
    'GET /api/suites': () => {
      const suites = findSuites(project);
      return Response.fromJson(
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
