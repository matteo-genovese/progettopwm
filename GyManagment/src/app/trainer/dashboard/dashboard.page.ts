import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonRefresher, IonRefresherContent, IonCardContent,   
  IonIcon, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule, IonRefresher, IonRefresherContent, 
    IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonItem, IonLabel, RouterLink, 
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent
  ]
})
export class DashboardPage implements OnInit {
  dashboardData: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private trainerService: TrainerService,
    private dateTimeService: DateTimeService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  ionViewWillEnter() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.trainerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        
        // Aggiungi proprietà formattate per tutte le sessioni
        if (this.dashboardData && this.dashboardData.upcoming_sessions) {
          this.dashboardData.upcoming_sessions.forEach((session: any) => {
            session.adjustedStartTime = this.dateTimeService.formatDateTime(session.start_time);
            session.adjustedStartDate = this.dateTimeService.formatDate(session.start_time);
            session.adjustedStartTimeOnly = this.dateTimeService.formatTime(session.start_time);
            session.adjustedEndTime = this.dateTimeService.formatDateTime(session.end_time);
            session.adjustedEndTimeOnly = this.dateTimeService.formatTime(session.end_time);
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

  doRefresh(event: any) {
    this.loadDashboard();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  
  calculateAverageRating(data: { ratings: { rating: number }[] }): number {
    const ratings = data.ratings;
    if (!ratings || ratings.length === 0) return 0;

    const somma = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const media = somma / ratings.length;
    return parseFloat(media.toFixed(1));
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}

