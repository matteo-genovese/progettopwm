import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonRefresher, IonRefresherContent, IonCardContent, IonItem, IonLabel, IonSpinner, IonIcon, IonButtons, IonButton,
  AlertController, ToastController 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    IonRefresher,
    IonRefresherContent, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonItem, IonLabel, IonSpinner, RouterLink, IonButtons, IonButton
  ]
})
export class DashboardPage implements OnInit {
  dashboardData: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private trainerService: TrainerService,
    private dateTimeService: DateTimeService,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController

  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  // Metodi wrapper che utilizzano il servizio
  formatDateTime(dateString: string): string {
    return this.dateTimeService.formatDateTime(dateString);
  }

  formatDate(dateString: string): string {
    return this.dateTimeService.formatDate(dateString);
  }

  formatTime(dateString: string): string {
    return this.dateTimeService.formatTime(dateString);
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

