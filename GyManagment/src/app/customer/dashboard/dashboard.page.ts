import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  fitnessOutline, 
  timeOutline, 
  starOutline,
  personOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
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
    IonItem,
    IonList,
    IonIcon,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText
  ]
})
export class DashboardPage implements OnInit {
  userData: any;
  upcomingBookings: any[] = [];
  isLoading = false;
  myTrainer: any = null;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router
  ) {
    addIcons({ calendarOutline, fitnessOutline, timeOutline, starOutline, personOutline });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  loadUserData() {
    this.userData = this.authService.getUser();
  }

  loadDashboardData() {
    this.isLoading = true;
  }

  doRefresh(event: any) {
    this.loadDashboardData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  viewAllTrainers() {
    this.router.navigate(['/customer/trainers']);
  }

  viewAllBookings() {
    this.router.navigate(['/customer/bookings']);
  }

  rateTrainer(trainerId: number) {
    // Implementeremo questa funzione più avanti
    this.customerService.openRatingModal(trainerId);
  }
}
