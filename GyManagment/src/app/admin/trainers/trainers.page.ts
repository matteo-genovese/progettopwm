import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonButton,
  IonRefresherContent
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
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList,
    IonItem,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonRefresher,
	IonButton,
    IonRefresherContent
  ]
})
export class TrainersPage implements OnInit {
  trainers: any[] = [];
  customers: any[] = [];
  isLoading = false;
  error = '';
  showCustomers: boolean = false;
  selectedTrainerId: number | null = null;
  

  constructor(private authService: AuthService) {
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
        console.error('Raw error:', error);
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

  getAllCustomers() {
    this.authService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.showCustomers = true;
      },
      error: (error) => {
        console.error('Errore nel caricamento clienti:', error);
      }
    });
  }

  showCustomerList(trainerId: number) {
    if (this.selectedTrainerId === trainerId) {
      // Se già aperto, chiudi
      this.selectedTrainerId = null;
      return;
    }
    // Altrimenti apri e carica clienti
    this.authService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.selectedTrainerId = trainerId;
      },
      error: (error) => {
        console.error('Errore nel caricamento clienti:', error);
      }
    });
  }

  hideCustomerList() {
    this.selectedTrainerId = null;
  }

  // assignTrainerToCustomer(trainerId: number, customer: any) {
  //   this.authService.assignTrainerToCustomer(customer.id, trainerId).subscribe({
  //     next: (response) => { /* ... */ },
  //     error: (error) => { /* ... */ }
  //   });
  // }
}
