// main.ts
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 👇 Esto carga el idioma español
registerLocaleData(localeEs);

// 👇 Esto arranca la app y le dice: "usa español como idioma por defecto"
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-CL' } // 🎯 ESTA línea hace que funcione
  ]
});
