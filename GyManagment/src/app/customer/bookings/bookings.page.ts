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
  IonCard, 
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
  AlertController
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
    IonCard,
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
    private alertController: AlertController
  ) {
    addIcons({ calendarOutline, timeOutline, closeCircleOutline, starOutline });
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.allBookings = [
          ...(data.upcoming_bookings || []),
          ...(data.past_bookings || [])
        ];
        this.filterBookings();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.allBookings = [];
        this.filterBookings();
        this.isLoading = false;
      }
    });
  }

  filterBookings() {
    const now = new Date();
    
    this.upcomingBookings = this.allBookings.filter(booking => 
      new Date(booking.start_time) > now
    ).sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    
    this.pastBookings = this.allBookings.filter(booking => 
      new Date(booking.start_time) <= now
    ).sort((a, b) => 
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );
  }

  segmentChanged() {
    console.log('Segment changed to', this.selectedTab);
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
