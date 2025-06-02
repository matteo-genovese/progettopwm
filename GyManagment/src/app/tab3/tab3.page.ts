import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  IonIcon,
  IonList,
  IonSpinner,
  IonAvatar,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, mailOutline, keyOutline, idCardOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonIcon,
    IonList,
    IonSpinner,
    IonAvatar
  ]
})
export class Tab3Page implements OnInit {
  userData: any = null;
  isLoading = false;

  constructor(
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
      idCardOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.userData = this.authService.getUser();
    console.log('User data loaded:', this.userData);
  }

  getRoleLabel(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Amministratore';
      case 'trainer': return 'Allenatore';
      case 'customer': return 'Cliente';
      default: return role || 'Utente';
    }
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
