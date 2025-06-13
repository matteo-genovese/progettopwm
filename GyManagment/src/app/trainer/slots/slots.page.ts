import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonItem, IonLabel, IonSpinner, IonInput, IonDatetime, 
  IonIcon, IonButtons, IonModal, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, timeOutline, peopleOutline, addOutline, 
  addCircleOutline, closeOutline, chevronForward, chevronBack
} from 'ionicons/icons';
import { TrainerService } from '../../services/trainer.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonButton, IonItem, IonLabel, IonSpinner, 
    IonInput, IonDatetime, IonIcon, IonModal
  ]
})
export class SlotsPage implements OnInit {
  slotDate: string = '';
  startTime: string = '';
  endTime: string = '';
  // Nuove variabili per i time picker
  startTimePicker: string = '';
  endTimePicker: string = '';
  newSlot = { start_time: '', end_time: '', max_clients: 1 };
  isLoading = false;
  error: string | null = null;
  minDate = new Date().toISOString();
  
  // Variabili per controllare i popup di selezione orario
  showStartTimePicker = false;
  showEndTimePicker = false;

  constructor(
    private trainerService: TrainerService,
    private toastController: ToastController
  ) {
    // Registra le icone ionicons
    addIcons({
      calendarOutline, timeOutline, peopleOutline, addOutline,
      addCircleOutline, closeOutline, chevronForward, chevronBack
    });
  }

  ngOnInit() {
    // Inizializza con la data corrente
    this.slotDate = new Date().toISOString();
    
    const now = new Date();
    this.startTime = now.toISOString();
    const end = new Date(now.getTime() + 60 * 60 * 1000); // aggiunge 1 ora
    this.endTime = end.toISOString();
  }
  
  // Arrotonda l'ora
  roundToNextHour(date: Date, hoursToAdd: number = 1): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hoursToAdd);
    result.setMinutes(0, 0, 0);
    return result;
  }
  
  // Formatta l'ora nel formato HH:MM
  formatTime(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.getHours().toString().padStart(2, '0') + ':' + 
           date.getMinutes().toString().padStart(2, '0');
  }
  
  // Apre il picker per l'orario di inizio
  openStartTimePicker() {
    // Prepara il valore corretto per il picker aggiungendo 2 ore per compensare il fuso orario
    const date = new Date(this.startTime);
    date.setHours(date.getHours() + 2);
    this.startTimePicker = date.toISOString();
    this.showStartTimePicker = true;
  }
  
  // Apre il picker per l'orario di fine
  openEndTimePicker() {
    // Prepara il valore corretto per il picker aggiungendo 2 ore per compensare il fuso orario
    const date = new Date(this.endTime);
    date.setHours(date.getHours() + 2);
    this.endTimePicker = date.toISOString();
    this.showEndTimePicker = true;
  }

  private combineDateTime(date: string | null, time: string | null): string {
    if (!date || !time) return '';
    const d = new Date(date);
    const t = new Date(time);
    
    d.setHours(t.getHours() - 2, t.getMinutes(), 0, 0);
    
    // Formato semplice senza timezone (come la prenotazione ID 9)
    return d.getFullYear() + '-' + 
          String(d.getMonth() + 1).padStart(2, '0') + '-' + 
          String(d.getDate()).padStart(2, '0') + ' ' + 
          String(d.getHours()).padStart(2, '0') + ':' + 
          String(d.getMinutes()).padStart(2, '0') + ':00';
  }
  
  // Mostra un messaggio toast
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  addSlot() {
    this.isLoading = true;
    this.error = null;
    
    // Combina data e ora
    this.newSlot.start_time = this.combineDateTime(this.slotDate, this.startTime);
    this.newSlot.end_time = this.combineDateTime(this.slotDate, this.endTime);
    
    // Controlla che l'orario di fine sia successivo all'orario di inizio
    if (new Date(this.newSlot.end_time) <= new Date(this.newSlot.start_time)) {
      this.isLoading = false;
      this.error = "L'orario di fine deve essere successivo all'orario di inizio";
      this.presentToast(this.error || 'Errore sconosciuto', 'danger');
      return;
    }
    
    // Chiamata al servizio
    this.trainerService.createSlot(this.newSlot).subscribe({
      next: () => {
        this.isLoading = false;
        this.presentToast('Slot creato con successo');
        
        // Reset dei campi
        const now = new Date();
        this.startTime = now.toISOString();
        const end = new Date(now.getTime() + 60 * 60 * 1000); // aggiunge 1 ora
        this.endTime = end.toISOString();
        this.newSlot.max_clients = 1;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Errore durante la creazione dello slot';
        this.presentToast(this.error || 'Errore sconosciuto', 'danger');
      }
    });
  }

  closeStartTimePicker() {
    const date = new Date(this.startTimePicker);
    date.setHours(date.getHours());
    this.startTime = date.toISOString();
    this.showStartTimePicker = false;
  }

  closeEndTimePicker() {
    const date = new Date(this.endTimePicker);
    date.setHours(date.getHours());
    this.endTime = date.toISOString();
    this.showEndTimePicker = false;
  }

  onTimePickerDismiss(pickerType: 'start' | 'end') {
    if (pickerType === 'start') {
      // Applica anche qui la correzione del fuso orario
      const date = new Date(this.startTimePicker);
      date.setHours(date.getHours());
      this.startTime = date.toISOString();
      this.showStartTimePicker = false;
    } else {
      // Applica anche qui la correzione del fuso orario
      const date = new Date(this.endTimePicker);
      date.setHours(date.getHours());
      this.endTime = date.toISOString();
      this.showEndTimePicker = false;
    }
  }
}
