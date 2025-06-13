import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
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
import { fitnessOutline, mailOutline, callOutline, calendarOutline, barbell } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonBackButton,
    IonButtons,
	  IonButton,
    IonIcon,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonRefresher,
    IonRefresherContent
  ]
})
export class CustomersPage implements OnInit {
  customers: any[] = [];
  trainers: any[] = [];
  isLoading = false;
  error = '';
  selectedCustomerId: number | null = null;

  constructor(private authService: AuthService) {
    addIcons({ fitnessOutline, mailOutline, callOutline, calendarOutline, barbell });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.error = '';
    
    this.authService.getAllCustomers().subscribe({
      next: (data) => {
        console.log('Customers data received:', data);
        this.customers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Raw error:', error);
        this.error = 'Impossibile caricare i clienti. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadCustomers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
