import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routeConfig } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routeConfig)
  ]
};
