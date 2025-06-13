import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonList, IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  fitnessOutline, personAddOutline, shieldOutline, calendarOutline, peopleOutline
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, 
    IonItem, IonIcon, IonLabel, IonGrid, IonRow, IonCol, CommonModule, FormsModule, RouterLink
  ]
})
export class HomePage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      fitnessOutline, personAddOutline, shieldOutline, calendarOutline, peopleOutline
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      if (this.authService.isAdmin())
        this.router.navigate(['/admin']);
      else if (this.authService.isCustomer())
        this.router.navigate(['/customer']);
      else if (this.authService.isTrainer())
        this.router.navigate(['/trainer']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
