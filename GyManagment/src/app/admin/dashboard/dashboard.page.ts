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
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonButtons,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  fitnessOutline,
  statsChartOutline,
  personOutline,
  logOutOutline,
  barbell,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
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
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons
  ]
})
export class DashboardPage implements OnInit {
  adminData: any;
  trainersCount: number = 0;
  customersCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
  ) {
    addIcons({ peopleOutline, fitnessOutline, statsChartOutline, personOutline, logOutOutline,barbell });
  }

  ngOnInit() {
    this.adminData = this.authService.getUser();
    this.loadCounts();
  }

  loadCounts() {
    // Carica il conteggio di trainers
    this.authService.getAllTrainers().subscribe({
      next: (trainers) => {
        this.trainersCount = trainers.length;
      },
      error: (error) => {
        console.error('Error fetching trainers count:', error);
      }
    });

    // Carica il conteggio di customers
    this.authService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customersCount = customers.length;
      },
      error: (error) => {
        console.error('Error fetching customers count:', error);
      }
    });
  }

  goToTrainers() {
    this.router.navigate(['/admin/trainers']);
  }

  goToCustomers() {
    this.router.navigate(['/admin/customers']);
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Conferma logout',
      message: 'Sei sicuro di voler effettuare il logout?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Logout',
          cssClass: 'danger',
          handler: () => {
            // Esegui il logout tramite il servizio AuthService
            this.authService.logout().subscribe({
              next: () => {
                // Naviga alla pagina di login
                window.location.href = '/login';
              },
              error: (err) => {
                console.error('Errore durante il logout:', err);
                // In caso di errore, esegui comunque il logout lato client
                window.location.href = '/login';
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
