import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('TrainerGuard check - isTrainer:', authService.isTrainer());

  if (authService.isLoggedIn() && authService.isTrainer()) {
    console.log('TrainerGuard: allowing access to', state.url);
    return true;
  } else {
    console.log('TrainerGuard: redirecting to home');

    if (authService.isLoggedIn() && authService.isAdmin()) {
      router.navigate(['/admin/dashboard']);
    } else if (authService.isLoggedIn() && authService.isCustomer()) {
      router.navigate(['/customer']);
    } else {
      router.navigate(['/home']);
    }
    
    return false;
  }
};
