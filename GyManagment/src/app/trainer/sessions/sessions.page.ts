import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'
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
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonSpinner, IonCard, IonCardContent,
    IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonIcon, IonButton, IonCardHeader, IonCardSubtitle, RouterLink
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

  // Helper method to adjust timezone by adding 2 hours
  adjustTimeZone(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date;
  }

  // Format date for display with timezone correction
  formatDateTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format only the date part
  formatDate(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Format only the time part
  formatTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadSessions() {
    this.isLoading = true;
    this.error = null;

    this.trainerService.getSchedule().subscribe({
      next: (data) => {
        this.sessions = data || [];
        const now = new Date();

        // Process sessions to add adjusted time properties for display
        this.sessions.forEach(session => {
          // Add adjusted time properties that can be used in the template
          session.adjustedStartTime = this.formatDateTime(session.start_time);
          session.adjustedStartDate = this.formatDate(session.start_time);
          session.adjustedStartTimeOnly = this.formatTime(session.start_time);
          session.adjustedEndTime = this.formatDateTime(session.end_time);
          session.adjustedEndTimeOnly = this.formatTime(session.end_time);
        });

        this.upcomingSessions = this.sessions.filter(
          s => this.adjustTimeZone(s.start_time) > now
        ).sort((a, b) => this.adjustTimeZone(a.start_time).getTime() - this.adjustTimeZone(b.start_time).getTime());

        this.upcomingFullSessions = this.upcomingSessions.filter(
          session => session.booked_clients === session.max_clients
        );

        this.upcomingAvailableSessions = this.upcomingSessions.filter(
          session => session.booked_clients < session.max_clients
        );

        this.pastSessions = this.sessions.filter(
          s => this.adjustTimeZone(s.start_time) <= now
        ).sort((a, b) => this.adjustTimeZone(b.start_time).getTime() - this.adjustTimeZone(a.start_time).getTime());
        
        // console.log('upcomingAvailableSessions test: ' + this.formatDateTime(this.upcomingAvailableSessions[0].start_time));
        
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli allenamenti';
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadSessions();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
