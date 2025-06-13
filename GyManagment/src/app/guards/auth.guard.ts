import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // console.log('AuthGuard check - isLoggedIn:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    // L'utente è autenticato, può procedere
    return true;
  } else {
    // L'utente non è autenticato, reindirizza al login
    // console.log('AuthGuard: redirecting to login page');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};
