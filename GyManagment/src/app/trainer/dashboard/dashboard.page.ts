import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSpinner, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSpinner, RouterLink
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

  // Helper method to adjust timezone by adding 2 hours
  adjustTimeZone(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date;
  }

  // Format date for display with timezone correction
  formatDateTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format only the date part
  formatDate(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Format only the time part
  formatTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadDashboard() {
    this.isLoading = true;
    this.trainerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        
        // Aggiungi proprietà formattate per tutte le sessioni
        if (this.dashboardData && this.dashboardData.upcoming_sessions) {
          this.dashboardData.upcoming_sessions.forEach((session: any) => {
            session.adjustedStartTime = this.formatDateTime(session.start_time);
            session.adjustedStartDate = this.formatDate(session.start_time);
            session.adjustedStartTimeOnly = this.formatTime(session.start_time);
            session.adjustedEndTime = this.formatDateTime(session.end_time);
            session.adjustedEndTimeOnly = this.formatTime(session.end_time);
          });
        }
        
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
