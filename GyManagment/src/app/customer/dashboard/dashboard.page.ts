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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonIcon, IonRefresher, IonRefresherContent,
    AppHeaderComponent, LoadingSpinnerComponent
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

  loadDashboardData() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.userData = data.user_info;
        this.upcomingBookings = (data.upcoming_bookings || []);
        
        // Aggiungi le proprietà formattate per il fuso orario
        this.upcomingBookings.forEach(booking => {
          booking.adjustedStartTime = this.dateTimeService.formatDateTime(booking.start_time);
          booking.adjustedStartDate = this.dateTimeService.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.dateTimeService.formatTime(booking.start_time);
          booking.adjustedEndTime = this.dateTimeService.formatDateTime(booking.end_time);
          booking.adjustedEndTimeOnly = this.dateTimeService.formatTime(booking.end_time);
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

  onLogout() {
    this.authService.logoutWithUI();
  }
}
