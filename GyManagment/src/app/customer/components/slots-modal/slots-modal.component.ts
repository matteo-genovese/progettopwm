import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, calendarOutline, timeOutline, star } from 'ionicons/icons';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-slots-modal',
  templateUrl: './slots-modal.component.html',
  styleUrls: ['./slots-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonSpinner,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class SlotsModalComponent implements OnInit {
  @Input() trainer: any;
  
  selectedDate: string = '';
  minDate: string = '';
  
  // Struttura per raggruppare gli slot per data
  slotsByDate: { [date: string]: any[] } = {};
  allDates: string[] = [];
  
  isLoading = false;
  
  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    addIcons({ closeOutline, calendarOutline, timeOutline, star });
  }

  ngOnInit() {
    // Inizializza le date
    const today = new Date();
    
    this.selectedDate = today.toISOString();
    this.minDate = today.toISOString();
    
    this.loadAllFutureSlots();
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

  close() {
    this.modalCtrl.dismiss();
  }

  // Carica gli slot futuri a partire dalla data selezionata senza limitazioni di giorni
  loadAllFutureSlots() {
    if (!this.trainer || !this.trainer.id) return;
    
    this.isLoading = true;
    this.slotsByDate = {};
    this.allDates = [];
    
    const startDate = new Date(this.selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    // Carica gli slot disponibili per il trainer usando l'endpoint corretto
    this.customerService.getAvailableSlots(this.trainer.id, this.formatDateForAPI(startDate.toISOString())).subscribe({
      next: (slots) => {
        console.log('Slot ricevuti:', slots);
        
        if (slots && Array.isArray(slots)) {
          // Raggruppa gli slot per data e filtra quelli precedenti alla data selezionata
          slots.forEach(slot => {
            if (!slot.start_time) {
              console.error('Slot senza start_time:', slot);
              return;
            }
            
            try {
              // Estrai la data dallo slot
              const slotDate = this.formatDateForAPI(slot.start_time);
              const slotDateTime = new Date(slotDate);
              slotDateTime.setHours(0, 0, 0, 0);
              
              // Verifica che la data dello slot sia >= alla data selezionata
              if (slotDateTime >= startDate) {
                if (!this.slotsByDate[slotDate]) {
                  this.slotsByDate[slotDate] = [];
                  this.allDates.push(slotDate);
                }
                
                // Aggiungi proprietà con orari corretti
                slot.adjustedStartTime = this.formatDateTime(slot.start_time);
                slot.adjustedStartTimeOnly = this.formatTime(slot.start_time);
                slot.adjustedEndTime = this.formatDateTime(slot.end_time);
                slot.adjustedEndTimeOnly = this.formatTime(slot.end_time);
                
                this.slotsByDate[slotDate].push(slot);
              }
            } catch (e) {
              console.error('Errore nel parsare la data:', slot.start_time, e);
            }
          });
          
          // Ordina le date
          this.allDates.sort();
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.isLoading = false;
        this.showToast('Impossibile caricare gli slot disponibili', 'danger');
      }
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.loadAllFutureSlots();
  }

  bookSlot(slotId: number) {
    this.isLoading = true;
    
    this.customerService.bookSession(slotId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showToast('Prenotazione effettuata con successo!', 'success');
        this.loadAllFutureSlots(); // Ricarica gli slot per aggiornare la disponibilità
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error booking slot:', error);
        
        // Estrai il messaggio di errore specifico dal server
        let errorMessage = 'Errore durante la prenotazione. Riprova più tardi.';
        
        if (error.error && error.error.message) {
          // Usa esattamente il messaggio restituito dal server
          errorMessage = error.error.message;
        }
        
        this.showToast(errorMessage, 'danger');
      }
    });
  }

  // Formatta una data ISO in formato YYYY-MM-DD per l'API
  private formatDateForAPI(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Formatta una data per la visualizzazione
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('it-IT', options);
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}
