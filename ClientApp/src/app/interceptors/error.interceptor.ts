import { HttpErrorResponse } from '@angular/common/http';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../Services/auth-service ';
import { Router } from '@angular/router';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401){
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => new Error(error.message));
    })
  );
}