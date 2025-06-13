import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonList,
  IonSpinner,
  IonAvatar,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, mailOutline, keyOutline, idCardOutline, fitnessOutline, peopleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { TrainerService } from '../../services/trainer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonBackButton,
    IonIcon,
    IonList,
    IonSpinner,
    IonAvatar,
    IonButtons
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
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      logOutOutline,
      personCircleOutline,
      mailOutline,
      keyOutline,
      idCardOutline,
      fitnessOutline,
      peopleOutline
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
