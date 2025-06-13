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
  keyOutline, idCardOutline, fitnessOutline, peopleOutline 
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { TrainerService } from '../../services/trainer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonIcon, IonList, 
    IonSpinner, IonAvatar, IonButtons, IonBackButton
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
      idCardOutline, fitnessOutline, peopleOutline
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
}
