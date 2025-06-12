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
import { CustomerService } from '../../services/customer.service';
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
  trainers: any[] = [];

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
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        
        //filtro per escludere gli allenamenti passati 
        const now = new Date();
        this.upcomingBookings = (data.upcoming_bookings || [])
          .filter((booking: any) => new Date(booking.start_time) > now)
          .sort((a: any, b: any) => {
            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
          });
        
        this.myTrainer = data.trainer || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.upcomingBookings = [];
        this.myTrainer = null;
        this.isLoading = false;
      }
    });

    this.customerService.getAvailableTrainers().subscribe({
      next: (data) => {
        this.trainers = data.slice(0, 6); // Mostra solo i primi 6 trainer
      },
      error: (err) => {
        console.error('Errore nel caricamento dei trainer:', err);
        this.trainers = [];
      }
    });
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
    this.customerService.openRatingModal(trainerId);
  }
}
