import { Routes } from '@angular/router';
import { TrainersTabsPage } from './trainer-tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TrainersTabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'sessions',
        loadComponent: () => import('../sessions/sessions.page').then(m => m.SessionsPage)
      },
      {
        path: 'slots',
        loadComponent: () => import('../slots/slots.page').then(m => m.SlotsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: '/trainer/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
