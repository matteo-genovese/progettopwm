import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSpinner, IonCard, IonCardContent,
  IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon, IonButton,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
  standalone: true,
  imports: [
    IonRow, IonGrid, IonCol, IonCardTitle, CommonModule, FormsModule, IonCard,
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSpinner, IonCardContent,
    IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon,
    IonButton, IonCardHeader, IonCardSubtitle, RouterLink, IonButtons, IonBackButton,
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent
  ]
})
export class SessionsPage implements OnInit {
  isLoading = false;
  error: string | null = null;
  sessions: any[] = [];
  upcomingSessions: any[] = [];
  upcomingFullSessions: any[] = [];
  upcomingAvailableSessions: any[] = [];
  pastSessions: any[] = [];
  selectedTab: 'upcoming' | 'past' = 'upcoming';

  constructor(
    private trainerService: TrainerService,
    private dateTimeService: DateTimeService,
    private authService: AuthService,  
  ) {}

  ngOnInit() {
    this.loadSessions();
  }

  // Utilizzo i metodi del servizio centralizzato
  formatDateTime(dateString: string): string {
    return this.dateTimeService.formatDateTime(dateString);
  }

  formatDate(dateString: string): string {
    return this.dateTimeService.formatDate(dateString);
  }

  formatTime(dateString: string): string {
    return this.dateTimeService.formatTime(dateString);
  }

  ionViewWillEnter() {
    this.loadSessions();
  }

  loadSessions() {
    this.isLoading = true;
    this.error = null;

    this.trainerService.getSchedule().subscribe({
      next: (data) => {
        this.sessions = data || [];
        const now = new Date();

        // Process sessions to add adjusted time properties for display
        this.sessions.forEach(session => {
          // Aggiungi proprietà formattate per orari
          session.adjustedStartTime = this.formatDateTime(session.start_time);
          session.adjustedStartDate = this.formatDate(session.start_time);
          session.adjustedStartTimeOnly = this.formatTime(session.start_time);
          session.adjustedEndTime = this.formatDateTime(session.end_time);
          session.adjustedEndTimeOnly = this.formatTime(session.end_time);
        });

        this.upcomingSessions = this.sessions.filter(
          s => new Date(this.dateTimeService.adjustTimeZone(s.start_time)) > now
        ).sort((a, b) => new Date(this.dateTimeService.adjustTimeZone(a.start_time)).getTime() - 
                          new Date(this.dateTimeService.adjustTimeZone(b.start_time)).getTime());

        this.upcomingFullSessions = this.upcomingSessions.filter(
          session => session.booked_clients === session.max_clients
        );

        this.upcomingAvailableSessions = this.upcomingSessions.filter(
          session => session.booked_clients < session.max_clients
        );

        this.pastSessions = this.sessions.filter(
          s => new Date(this.dateTimeService.adjustTimeZone(s.start_time)) <= now
        ).sort((a, b) => new Date(this.dateTimeService.adjustTimeZone(b.start_time)).getTime() - 
                         new Date(this.dateTimeService.adjustTimeZone(a.start_time)).getTime());
        
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli allenamenti';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadSessions();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}

