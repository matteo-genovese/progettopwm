import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard check - isLoggedIn:', authService.isLoggedIn());
  
  if (authService.isLoggedIn()) {
    console.log('AuthGuard: allowing access to tabs');
    return true;
  } else {
    console.log('AuthGuard: redirecting to home');
    router.navigate(['/home']);
    return false;
  }
};
