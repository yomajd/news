import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth-service ';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>
   {
    const auth = inject(AuthService);
    const token = auth.getToken();

    if (!token || !auth.isAuthenticated()) { 
      return next(req);
    }
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    const newReq = req.clone({headers});

    return next(newReq);
  }
