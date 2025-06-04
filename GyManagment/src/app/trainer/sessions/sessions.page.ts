import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent, IonIcon, IonListHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
  standalone: true,
  imports: [IonListHeader, 
    IonIcon,
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent
  ]
})
export class SessionsPage implements OnInit {
  isLoading = false;
  error: string | null = null;
  sessions: any[] = [];
  upcomingSessions: any[] = [];
  pastSessions: any[] = [];

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.isLoading = true;
    this.error = null;
    this.trainerService.getSchedule().subscribe({
      next: (data) => {
        this.sessions = data || [];
        const now = new Date();
        this.upcomingSessions = this.sessions.filter(
          s => new Date(s.end_time) >= now
        );
        this.pastSessions = this.sessions.filter(
          s => new Date(s.end_time) < now
        );
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli allenamenti';
        this.isLoading = false;
      }
    });
  }
}