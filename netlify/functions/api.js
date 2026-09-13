import serverless from 'serverless-http';
import appModule from '../../server/index.js';

const app = appModule.default || appModule;

export const handler = serverless(app);
