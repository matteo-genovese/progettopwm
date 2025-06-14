import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonButtons, 
  IonIcon, IonList, IonSpinner, IonAvatar, IonBackButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, personCircleOutline, mailOutline, 
  keyOutline, idCardOutline, fitnessOutline, peopleOutline, 
  starOutline,
  star
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { TrainerService } from '../../services/trainer.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DetailCardComponent } from 'src/app/shared/components/detail-card/detail-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonList, IonAvatar, 
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent,
    DetailCardComponent
  ]
})
export class ProfilePage implements OnInit {
  trainerData: any = null;
  userData: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private trainerService: TrainerService,
    private authService: AuthService,
  ) {
    addIcons({
      logOutOutline, personCircleOutline, mailOutline, keyOutline, 
      idCardOutline, fitnessOutline, peopleOutline, starOutline, star
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  

  loadUserData() {
    this.isLoading = true;
    this.error = null;
    
    // Get basic user data from AuthService
    this.userData = this.authService.getUser();
    
    // Get trainer-specific data from TrainerService
    this.trainerService.getDashboard().subscribe({
      next: (dashboardData) => {
        this.trainerData = dashboardData;
        console.log('Dashboard data:', this.trainerData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'Errore nel caricamento dei dati';
        this.isLoading = false;
      }
    });
  }

  onLogout() {
    this.authService.logoutWithUI();
  }

  generateStars(rating: number): { filled: boolean }[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({ filled: i <= rating });
    }
    return stars;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data non disponibile';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
