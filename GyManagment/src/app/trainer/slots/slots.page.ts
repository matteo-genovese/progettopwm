import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonListHeader, IonButton, IonItem, IonLabel, IonSpinner, IonInput, IonDatetime
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonListHeader, IonButton, IonItem, IonLabel, IonSpinner, IonInput, IonDatetime
  ]
})
export class SlotsPage implements OnInit {
  slots: any[] = [];
  newSlot = { start_time: '', end_time: '', max_clients: 1 };
  isLoading = false;
  error: string | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.isLoading = true;
    this.error = null;
    this.trainerService.getSchedule().subscribe({
      next: (data) => {
        this.slots = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Errore nel caricamento degli slot';
        this.isLoading = false;
      }
    });
  }

  addSlot() {
    if (!this.newSlot.start_time || !this.newSlot.end_time || !this.newSlot.max_clients) return;
    this.isLoading = true;
    this.error = null;

    const slotToSend = {
      start_time: this.formatDate(this.newSlot.start_time),
      end_time: this.formatDate(this.newSlot.end_time),
      max_clients: this.newSlot.max_clients
    };

    this.trainerService.createSlot(slotToSend).subscribe({
      next: () => {
        this.loadSlots();
        this.newSlot = { start_time: '', end_time: '', max_clients: 1 };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Errore nella creazione dello slot';
        this.isLoading = false;
        console.error('Errore POST slot:', err);
      }
    });
  }

  private formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }
}
