import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent, IonIcon, IonListHeader, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonButton, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, IonCardTitle, 
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon, IonListHeader, IonButton, IonCardHeader, IonCardSubtitle
  ]
})
export class SessionsPage implements OnInit {
  isLoading = false;
  error: string | null = null;
  sessions: any[] = [];
  upcomingSessions: any[] = [];
  upcomingFullSessions: any[] = [];
  upcomingAvailableSessions: any[] = [];
  pastSessions: any[] = [];
  selectedTab: 'upcoming' | 'past' = 'upcoming';

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
        ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        
        // Suddivisione delle sessioni future
        this.upcomingFullSessions = this.upcomingSessions.filter(
          session => session.booked_clients === session.max_clients
        );
        
        this.upcomingAvailableSessions = this.upcomingSessions.filter(
          session => session.booked_clients < session.max_clients
        );
        
        this.pastSessions = this.sessions.filter(
          s => new Date(s.end_time) < now
        ).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli allenamenti';
        this.isLoading = false;
      }
    });
  }

  segmentChanged() {
    // Placeholder per eventuali azioni future
  }

  doRefresh(event: any) {
    this.loadSessions();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}