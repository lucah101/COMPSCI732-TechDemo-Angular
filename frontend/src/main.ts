import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

//Bootstraps a standalone Angular app with routing enabled, using AppComponent as the entry point. (app.routes.ts)
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
