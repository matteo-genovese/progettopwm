import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'trainers',
    loadComponent: () => import('./trainers/trainers.page').then(m => m.TrainersPage)
  },
  {
    path: 'customers',
    loadComponent: () => import('./customers/customers.page').then(m => m.CustomersPage)
  }
];
