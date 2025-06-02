import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AdminGuard check - isAdmin:', authService.isAdmin());

  if (authService.isLoggedIn() && authService.isAdmin()) {
    console.log('AdminGuard: allowing access to', state.url);
    return true;
  } else {
    console.log('AdminGuard: redirecting - user is not admin');
    
    if (authService.isLoggedIn()) {
      if (authService.isCustomer()) {
        router.navigate(['/customer/dashboard']);
      } else if (authService.isTrainer()) {
        router.navigate(['/trainer/dashboard']);
      } else {
        router.navigate(['/home']);
      }
    } else {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
    }
    return false;
  }
};
