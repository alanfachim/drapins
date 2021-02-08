import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
 
  enableProdMode();
}
if(window.location.href.includes('http://drapins.com'))
window.location.replace(window.location.href.replace("http://drapins.com","https://www.drapins.com"));
if(window.location.href.includes('http://www.drapins.com'))
window.location.replace(window.location.href.replace("http://www.drapins.com","https://www.drapins.com"));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
