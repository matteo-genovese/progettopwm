import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { DateTimeService } from '../../services/date-time.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { DetailCardComponent } from 'src/app/shared/components/detail-card/detail-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonIcon, IonRefresher, IonRefresherContent,
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent, DetailCardComponent
  ]
})
export class DashboardPage implements OnInit {
  userData: any = null;
  upcomingBookings: any[] = [];
  trainers: any[] = [];
  isLoading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private dateTimeService: DateTimeService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.loadDashboardData();
  }

  // Metodi wrapper che utilizzano il servizio
  formatDateTime(dateString: string): string {
    return this.dateTimeService.formatDateTime(dateString);
  }

  formatDate(dateString: string): string {
    return this.dateTimeService.formatDate(dateString);
  }

  formatTime(dateString: string): string {
    return this.dateTimeService.formatTime(dateString);
  }

  loadDashboardData() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        
        this.userData = data.customer_info;
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
        this.trainers = data.slice(0, 6);
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

  viewAllBookings() {
    this.router.navigate(['/customer/bookings']);
  }

  viewAllTrainers() {
    this.router.navigate(['/customer/trainers']);
  }
  
  rateTrainer(trainerId: number) {
    this.customerService.openRatingModal(trainerId);
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
