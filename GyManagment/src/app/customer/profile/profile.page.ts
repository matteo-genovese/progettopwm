import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonLabel, IonButton, IonIcon, IonList, IonSpinner, IonAvatar, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, personCircleOutline, mailOutline, callOutline, idCardOutline 
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonItem, IonLabel, IonButton, IonIcon, IonList, IonSpinner, IonAvatar, IonButtons
  ]
})
export class ProfilePage implements OnInit {
  userData: any = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
  ) { 
    addIcons({ logOutOutline, personCircleOutline, mailOutline, callOutline, idCardOutline });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        this.userData = data.customer_info;
      },
      error: (err) => {
        console.error('Error loading profile data:', err);
      }
    });
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
