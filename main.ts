import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

function isElectron(){
 return  window && window.process && window.process['type'];
}

platformBrowserDynamic(providers).bootstrapModule(AppModule).then(() => {
  if ('serviceWorker' in navigator && environment.production && !isElectron()) {
    navigator.serviceWorker.register('/ngsw-worker.js') ;
  }
}).catch(err => console.log(err));
