import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { customerGuard } from '../../guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [customerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'trainers',
        loadComponent: () => import('../trainers/trainers.page').then(m => m.TrainersPage),
      },
      {
        path: 'bookings',
        loadComponent: () => import('../bookings/bookings.page').then(m => m.BookingsPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/customer/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
