import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service ';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {

   const authService = inject(AuthService);
   const router = inject(Router);
   const expectedRoles = route.data['roles'];

   if (!authService.isAuthenticated()){
    router.navigate(['/login']);
    return false;
   }

   if(!expectedRoles){
    return true;
   }

   if (!expectedRoles.includes(authService.getUserProfile())) {
    router.navigate(['/access-denied']);
    return false;
   }

   return true;
};
