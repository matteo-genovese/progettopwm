import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSpinner, IonCard, IonCardContent,
  IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon, IonButton,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow, IonButtons, AlertController, ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, IonCardTitle, 
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSpinner, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon,
    IonButton, IonCardHeader, IonCardSubtitle, RouterLink, IonButtons
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
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  
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


async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Conferma logout',
      message: 'Sei sicuro di voler effettuare il logout?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        }, {
          text: 'Logout',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

    logout() {
    this.isLoading = true;

    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Logout error:', error);
        this.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

}

