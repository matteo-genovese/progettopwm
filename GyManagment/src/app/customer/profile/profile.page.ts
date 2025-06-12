import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  personCircleOutline, 
  mailOutline, 
  callOutline,
  idCardOutline 
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';

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
    IonIcon,
    IonList,
    IonSpinner,
    IonAvatar
  ]
})
export class ProfilePage implements OnInit {
  userData: any = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      logOutOutline,
      personCircleOutline,
      mailOutline,
      callOutline,
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
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        this.userData = data.customer_info;
      },
      error: (err) => {
        console.error('Error loading profile data:', err);
      }
    });
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
