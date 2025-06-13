import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isCustomer()) {
    return true;
  } else {
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
