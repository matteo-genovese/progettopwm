import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { customerGuard } from '../guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [customerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../customer/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'trainers',
        loadComponent: () => import('../customer/trainers/trainers.page').then(m => m.TrainersPage),
      },
      {
        path: 'bookings',
        loadComponent: () => import('../customer/bookings/bookings.page').then(m => m.BookingsPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('../customer/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/customer/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
