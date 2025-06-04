import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonLabel, IonSpinner, IonInput, IonDatetime, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonLabel, IonSpinner, IonInput, IonDatetime
  ]
})
export class SlotsPage implements OnInit {
  slotDate: string = '';
  startTime: string = '';
  endTime: string = '';
  newSlot = { start_time: '', end_time: '', max_clients: 1 };
  isLoading = false;
  error: string | null = null;
  minDate = new Date().toISOString();

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {}

  addSlot() {
    // Componi le date/ore in formato ISO
    this.newSlot.start_time = this.combineDateTime(this.slotDate, this.startTime);
    this.newSlot.end_time = this.combineDateTime(this.slotDate, this.endTime);

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
        this.slotDate = '';
        this.startTime = '';
        this.endTime = '';
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

  // Combina data e ora in una stringa ISO
  private combineDateTime(date: string, time: string): string {
    if (!date || !time) return '';
    const d = new Date(date);
    const t = new Date(time);
    d.setHours(t.getHours(), t.getMinutes(), 0, 0);
    return d.toISOString();
  }

  // Formatta la data per il backend (YYYY-MM-DD HH:mm:00)
  private formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }
}
