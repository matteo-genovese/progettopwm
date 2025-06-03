import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent
  ]
})
export class SessionsPage implements OnInit {
  isLoading = false;
  sessions: any[] = [];
  error: string | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.isLoading = true;
    this.trainerService.getSchedule().subscribe({
      next: (data) => {
        this.sessions = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli allenamenti';
        this.isLoading = false;
      }
    });
  }
}