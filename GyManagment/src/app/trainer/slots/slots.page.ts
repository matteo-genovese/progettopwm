import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../../services/trainer.service';
import { DateTimeService } from '../../services/date-time.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, IonInput, IonDatetime, 
  IonIcon, IonModal, IonButtons, IonBackButton, AlertController, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, timeOutline, peopleOutline, addOutline, 
  addCircleOutline, closeOutline, chevronForward, chevronBack
} from 'ionicons/icons';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.page.html',
  styleUrls: ['./slots.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonButton, IonSpinner, 
    IonInput, IonDatetime, IonIcon, IonModal, IonButtons, IonBackButton
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
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController,
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


async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Conferma logout',
      message: 'Sei sicuro di voler effettuare il logout?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        }, {
          text: 'Logout',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

    logout() {
    this.isLoading = true;

    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Logout error:', error);
        this.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

}
