import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonIcon, 
  IonSpinner, IonCard, IonCardContent, IonRefresher, IonButton, IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, 
    IonIcon, IonSpinner, IonCard, IonCardContent, IonRefresher, IonButton, IonRefresherContent,
    AppHeaderComponent, LoadingSpinnerComponent
  ]
})
export class TrainersPage implements OnInit {
  trainers: any[] = [];
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {
    addIcons({ peopleOutline });
  }

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.isLoading = true;
    this.error = '';
    
    this.adminService.getAllTrainers().subscribe({
      next: (data) => {
        console.log('Trainers data received:', data);
        this.trainers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.error = 'Impossibile caricare i trainer. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadTrainers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  
  onLogout() {
    this.authService.logoutWithUI();
  }
}
