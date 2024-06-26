import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service ';
import { inject } from '@angular/core';
import { NewsService } from '../Services/news-service';
import { firstValueFrom } from 'rxjs';

export const EditNewsGuard: CanActivateFn = async (route) => {
  
  const authService = inject(AuthService);
  const newsService = inject(NewsService)
  const router = inject(Router);

  const newsId = route.paramMap.get('id');
  const currentUserEmail = authService.getUser()?.email;

  if(!newsId){
    router.navigate(['/']);
    return false;
  }

  if(!currentUserEmail){
    router.navigate(['/login']);
    return false;
  }

  try {
    const newsItem = await firstValueFrom(newsService.getNewsById(newsId));
    if (newsItem.creatorEmail === currentUserEmail) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (error) {
    router.navigate(['/unauthorized']);
    return false;
  }
};
