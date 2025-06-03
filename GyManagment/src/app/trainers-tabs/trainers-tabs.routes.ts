import { Routes } from '@angular/router';
import { TrainersTabsPage } from './trainers-tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TrainersTabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../trainers/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'sessions',
        loadComponent: () => import('../trainers/sessions/sessions.page').then(m => m.SessionsPage)
      },
      {
        path: 'slots',
        loadComponent: () => import('../trainers/slots/slots.page').then(m => m.SlotsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('../trainers/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: '/trainers-tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];