import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'trainers/sessions',
    loadComponent: () => import('./trainers/sessions/sessions.page').then( m => m.SessionsPage)
  },
  {
    path: 'trainers/slots',
    loadComponent: () => import('./trainers/slots/slots.page').then( m => m.SlotsPage)
  },
  {
    path: 'trainers/dashboard',
    loadComponent: () => import('./trainers/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'trainers-tabs',
    loadComponent: () => import('./trainers-tabs/trainers-tabs.page').then( m => m.TrainersTabsPage)
  },
  {
    path: 'trainers-tabs',
    loadChildren: () => import('./trainers-tabs/trainers-tabs.routes').then(m => m.routes)
  },  {
    path: 'profile',
    loadComponent: () => import('./trainers/profile/profile.page').then( m => m.ProfilePage)
  }



];
