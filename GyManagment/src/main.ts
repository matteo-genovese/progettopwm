import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(BrowserModule),
    { provide: DOCUMENT, useValue: document },
    // { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: 'UTC' } }
  ],
});
