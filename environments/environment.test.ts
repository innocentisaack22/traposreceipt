import { environmentSeed as env } from './enviromentSeed';
export const environment = {
  ...env,
  envName: 'TEST',
  production: false,
  test: true
};
