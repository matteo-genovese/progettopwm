import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // console.log('CustomerGuard check - isCustomer:', authService.isCustomer());

  if (authService.isLoggedIn() && authService.isCustomer()) {
    // console.log('CustomerGuard: allowing access to', state.url);
    return true;
  } else {
    // console.log('CustomerGuard: redirecting to home');
    
    if (authService.isLoggedIn() && authService.isAdmin()) {
      router.navigate(['/admin/dashboard']);
    } else if (authService.isLoggedIn() && authService.isTrainer()) {
      router.navigate(['/trainer']); // Devi creare questa rotta in futuro
    } else {
      router.navigate(['/home']);
    }
    
    return false;
  }
};
