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

  adjustTimeZone(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date;
  }

  // Format date for display with timezone correction
  formatDateTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format only the date part
  formatDate(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Format only the time part
  formatTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadDashboardData() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.upcomingBookings = (data.upcoming_bookings || []);
        
        // Aggiungi le proprietà formattate per il fuso orario
        this.upcomingBookings.forEach(booking => {
          booking.adjustedStartTime = this.formatDateTime(booking.start_time);
          booking.adjustedStartDate = this.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.formatTime(booking.start_time);
          booking.adjustedEndTime = this.formatDateTime(booking.end_time);
          booking.adjustedEndTimeOnly = this.formatTime(booking.end_time);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.upcomingBookings = [];
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
