import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonButtons
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  peopleOutline,  fitnessOutline, statsChartOutline, personOutline, logOutOutline, barbell,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonButton, IonIcon, IonItem, IonLabel, IonButtons,
    AppHeaderComponent
  ]
})
export class DashboardPage implements OnInit {
  adminData: any;
  trainersCount: number = 0;
  customersCount: number = 0;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
  ) {
    addIcons({ peopleOutline, fitnessOutline, statsChartOutline, personOutline, logOutOutline, barbell });
  }

  ngOnInit() {
    this.adminData = this.authService.getUser();
    this.loadCounts();
  }

  loadCounts() {
    this.adminService.getAllTrainers().subscribe({
      next: (trainers) => {
        this.trainersCount = trainers.length;
      },
      error: (error) => {
        console.error('Error fetching trainers count:', error);
      }
    });

    this.adminService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customersCount = customers.length;
      },
      error: (error) => {
        console.error('Error fetching customers count:', error);
      }
    });
  }

  goToTrainers() {
    this.router.navigate(['/admin/trainers']);
  }

  goToCustomers() {
    this.router.navigate(['/admin/customers']);
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
