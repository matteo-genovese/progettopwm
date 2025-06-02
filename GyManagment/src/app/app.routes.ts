import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { customerGuard } from './guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard, customerGuard]
  },
  // Preparazione per la sezione trainer
  // {
  //   path: 'trainer',
  //   loadChildren: () => import('./trainer/trainer.routes').then((m) => m.routes),
  //   canActivate: [authGuard, trainerGuard]
  // }
];
