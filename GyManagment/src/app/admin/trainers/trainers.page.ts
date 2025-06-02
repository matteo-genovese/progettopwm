import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonButton,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, fitnessOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList,
    IonItem,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonRefresher,
	IonButton,
    IonRefresherContent
  ]
})
export class TrainersPage implements OnInit {
  trainers: any[] = [];
  isLoading = false;
  error = '';

  constructor(private authService: AuthService) {
    addIcons({ mailOutline, callOutline, fitnessOutline });
  }

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.isLoading = true;
    this.error = '';
    
    this.authService.getAllTrainers().subscribe({
      next: (data) => {
        console.log('Trainers data received:', data);
        this.trainers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Raw error:', error);
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
}
