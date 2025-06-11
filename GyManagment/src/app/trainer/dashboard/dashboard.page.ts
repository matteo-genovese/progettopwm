import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonSpinner, IonIcon, IonAvatar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonIcon, 
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonSpinner, RouterLink
  ]
})
export class DashboardPage implements OnInit {
  dashboardData: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.trainerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento della dashboard';
        this.isLoading = false;
      }
    });
  }
  
  calculateAverageRating(data: { ratings: { rating: number }[] }): number {
    const ratings = data.ratings;
    if (!ratings || ratings.length === 0) return 0;

    const somma = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const media = somma / ratings.length;
    return parseFloat(media.toFixed(1));
}

}
