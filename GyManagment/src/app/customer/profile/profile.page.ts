import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle,  
  IonCardContent, IonIcon, IonList, IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, personCircleOutline, mailOutline, callOutline, idCardOutline 
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DetailCardComponent } from 'src/app/shared/components/detail-card/detail-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonIcon, IonList, IonAvatar, AppHeaderComponent,
    LoadingSpinnerComponent, DetailCardComponent
  ]
})
export class ProfilePage implements OnInit {
  userData: any = null;
  customerData: any = null;
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
    this.userData = this.authService.getUser();
    
    this.customerService.getCustomerDashboard().subscribe({
      next: (data) => {
        this.customerData = data.customer_info;
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
