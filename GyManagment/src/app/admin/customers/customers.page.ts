import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonIcon,
  IonSpinner, IonCard, IonCardContent, IonRefresher, IonButton, IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fitnessOutline, mailOutline, callOutline, calendarOutline, barbell } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, 
    IonButton, IonIcon, IonSpinner, IonCard, IonCardContent, IonRefresher, IonRefresherContent,
    AppHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent
  ]
})

export class CustomersPage implements OnInit {
  customers: any[] = [];
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {
    addIcons({ fitnessOutline, mailOutline, callOutline, calendarOutline, barbell });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  ionViewWillEnter() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;

    this.adminService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Impossibile caricare i clienti. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadCustomers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
