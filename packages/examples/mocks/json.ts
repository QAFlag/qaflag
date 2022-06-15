import { Mock } from '@qaflag/core';
import { readFileSync } from 'fs';
import path = require('path');

const init = () => {
  Mock.on('GET /users', {
    statusCode: 200,
    data: async () => {
      return readFileSync(
        path.resolve(__dirname, '../../fixtures/users.json'),
        'utf8',
      );
    },
  });

  Mock.on('GET /users/1', {
    statusCode: 200,
    data: async () => {
      return readFileSync(
        path.resolve(__dirname, '../../fixtures/user-1.json'),
        'utf8',
      );
    },
  });

  Mock.on('GET /users/10', {
    statusCode: 200,
    data: async () => {
      return readFileSync(
        path.resolve(__dirname, '../../fixtures/user-10.json'),
        'utf8',
      );
    },
  });
};

export default init;
