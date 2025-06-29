import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { DateTimeService } from '../../services/date-time.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendarOutline, timeOutline, closeCircleOutline, starOutline } from 'ionicons/icons';
import {
  IonContent, IonCard, IonCardSubtitle, IonLabel,
  IonRefresher, IonRefresherContent, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSegment, IonSegmentButton, IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DetailCardComponent } from 'src/app/shared/components/detail-card/detail-card.component';

interface Booking {
  id: number;
  trainer_id: number;
  trainer_name: string;
  start_time: string;
  end_time: string;
  specialization?: string;
  rated?: boolean;
  adjustedStartTimeOnly?: string;
  adjustedEndTimeOnly?: string;
  adjustedStartDate?: string;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonRefresher, IonSegment, 
    IonSegmentButton, IonLabel, IonRefresherContent, DetailCardComponent,
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent
  ]
})
export class BookingsPage implements OnInit {
  isLoading = false;
  upcomingBookings: Booking[] = [];
  pastBookings: Booking[] = [];
  selectedTab = 'upcoming';

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private dateTimeService: DateTimeService,
  ) {
    addIcons({ calendarOutline, timeOutline, closeCircleOutline, starOutline });
  }

  ngOnInit() {
    this.loadBookings();
  }

  ionViewWillEnter() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        this.upcomingBookings = data.upcoming_bookings || [];
        this.pastBookings = data.past_bookings || [];
        
        // Sistemo gli orari del booking 
        this.upcomingBookings.forEach(booking => {
          booking.adjustedStartDate = this.dateTimeService.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.dateTimeService.formatTime(booking.start_time);
          booking.adjustedEndTimeOnly = this.dateTimeService.formatTime(booking.end_time);
        });
        
        this.pastBookings.forEach(booking => {
          booking.adjustedStartDate = this.dateTimeService.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.dateTimeService.formatTime(booking.start_time);
          booking.adjustedEndTimeOnly = this.dateTimeService.formatTime(booking.end_time);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadBookings();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  goToTrainers() {
    this.router.navigate(['/customer/trainers']);
  }

  rateTrainer(trainerId: number) {
    this.customerService.openRatingModal(trainerId);
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
