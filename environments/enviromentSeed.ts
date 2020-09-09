// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const packageJson = require('../../package.json');

export const environmentSeed = {
  appName: packageJson.name,
  appTitle: packageJson.title,
  versionCode: packageJson.versionCode,
  version: packageJson.version,
  envName: 'DEV',
  production: false,
  test: false,
  i18nPrefix: '',
  authUrl: 'http://localhost:51980/',
  resourceUrl: 'http://localhost:58544/',
  auth: {
    client_id: 'edf6a8ad-83a6-42f7-b259-6167897f9428',
    client_secret: '0ab2519c-0929-11ea-9a9f-362b9e155667'
  },
  versions: {
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-free'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  }
};
