import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,  
  IonCardContent, IonButton, IonSpinner, IonInput, IonDatetime, 
  IonIcon, IonModal, IonButtons, IonCardTitle, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, timeOutline, peopleOutline, addOutline, 
  addCircleOutline, closeOutline, chevronForward, chevronBack
} from 'ionicons/icons';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonButton, IonSpinner, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonInput, IonDatetime, IonIcon, IonModal, IonButtons,
    AppHeaderComponent, LoadingSpinnerComponent
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
    private authService: AuthService,
    private uiService: UiService,
    private dateTimeService: DateTimeService
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
  
  // Usa i metodi dal servizio invece delle funzioni locali
  formatTimeLocal(isoString: string): string {
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

  addSlot() {
    this.isLoading = true;
    this.error = null;
    
    // Combina data e ora usando il servizio
    this.newSlot.start_time = this.dateTimeService.combineDateTime(this.slotDate, this.startTime);
    this.newSlot.end_time = this.dateTimeService.combineDateTime(this.slotDate, this.endTime);
    
    // Controlla che l'orario di fine sia successivo all'orario di inizio
    if (new Date(this.newSlot.end_time) <= new Date(this.newSlot.start_time)) {
      this.isLoading = false;
      this.error = "L'orario di fine deve essere successivo all'orario di inizio";
      this.uiService.showToast(this.error || 'Errore sconosciuto', 2000, 'top', 'danger');
      return;
    }
    
    // Chiamata al servizio
    this.trainerService.createSlot(this.newSlot).subscribe({
      next: () => {
        this.isLoading = false;
        this.uiService.showToast('Slot creato con successo', 2000, 'top', 'success');

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
        this.uiService.showToast(this.error || 'Errore sconosciuto', 2000, 'top', 'danger');
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
      const date = new Date(this.startTimePicker);
      date.setHours(date.getHours());
      this.startTime = date.toISOString();
      this.showStartTimePicker = false;
    } else {
      const date = new Date(this.endTimePicker);
      date.setHours(date.getHours());
      this.endTime = date.toISOString();
      this.showEndTimePicker = false;
    }
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
