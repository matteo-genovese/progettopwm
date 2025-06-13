import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonRefresher, 
  IonRefresherContent,
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  timeOutline, 
  closeCircleOutline, 
  starOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

interface Booking {
  id: number;
  trainer_id: number;
  trainer_name: string;
  start_time: string;
  end_time: string;
  specialization?: string;
  rated?: boolean;
  adjustedStartTime?: string;
  adjustedEndTime?: string;
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
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonRefresher,
    IonRefresherContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonSpinner
  ]
})
export class BookingsPage implements OnInit {
  isLoading = false;
  allBookings: Booking[] = [];
  upcomingBookings: Booking[] = [];
  pastBookings: Booking[] = [];
  selectedTab = 'upcoming';

  constructor(
    private customerService: CustomerService,
    private router: Router,
  ) {
    addIcons({ calendarOutline, timeOutline, closeCircleOutline, starOutline });
  }

  ngOnInit() {
    this.loadBookings();
  }

  // Helper method to adjust timezone by adding 2 hours
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

  loadBookings() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.upcomingBookings = data.upcoming_bookings || [];
        this.pastBookings = data.past_bookings || [];
        
        // Process bookings to add adjusted time properties for display
        this.upcomingBookings.forEach(booking => {
          booking.adjustedStartTime = this.formatDateTime(booking.start_time);
          booking.adjustedStartDate = this.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.formatTime(booking.start_time);
          booking.adjustedEndTime = this.formatDateTime(booking.end_time);
          booking.adjustedEndTimeOnly = this.formatTime(booking.end_time);
        });
        
        this.pastBookings.forEach(booking => {
          booking.adjustedStartTime = this.formatDateTime(booking.start_time);
          booking.adjustedStartDate = this.formatDate(booking.start_time);
          booking.adjustedStartTimeOnly = this.formatTime(booking.start_time);
          booking.adjustedEndTime = this.formatDateTime(booking.end_time);
          booking.adjustedEndTimeOnly = this.formatTime(booking.end_time);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.allBookings = [];
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
}
