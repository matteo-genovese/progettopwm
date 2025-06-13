import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonIcon, 
  IonSpinner, IonCard, IonCardContent, IonRefresher, IonButton, IonRefresherContent, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, 
    IonIcon, IonSpinner, IonCard, IonCardContent, IonRefresher, IonButton, IonRefresherContent
  ]
})
export class TrainersPage implements OnInit {
  trainers: any[] = [];
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({ peopleOutline });
    
  }

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.isLoading = true;
    this.error = '';
    
    this.authService.getAllTrainers().subscribe({
      next: (data) => {
        console.log('Trainers data received:', data);
        this.trainers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'Impossibile caricare i trainer. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadTrainers();
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


