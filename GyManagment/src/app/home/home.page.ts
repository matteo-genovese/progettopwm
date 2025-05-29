import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  fitnessOutline, 
  personAddOutline, 
  shieldOutline, 
  calendarOutline, 
  peopleOutline 
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    CommonModule, 
    FormsModule,
    RouterLink
  ]
})
export class HomePage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      fitnessOutline, 
      personAddOutline, 
      shieldOutline, 
      calendarOutline, 
      peopleOutline 
    });
  }

  ngOnInit() {
    // Se l'utente è già loggato, vai alle tabs
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/tabs']);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
