import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimeService } from '../../../services/date-time.service';
import { CustomerService } from '../../../services/customer.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonDatetime, IonDatetimeButton, IonModal,
  IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, calendarOutline, timeOutline, star } from 'ionicons/icons';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-slots-modal',
  templateUrl: './slots-modal.component.html',
  styleUrls: ['./slots-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe, IonHeader, IonToolbar, 
    IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, 
    IonItem, IonLabel, IonDatetime, IonDatetimeButton, IonModal,
    IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    LoadingSpinnerComponent
  ]
})

export class SlotsModalComponent implements OnInit {
  @Input() trainer: any;
  
  selectedDate: string = '';
  slotsByDate: { [date: string]: any[] } = {};
  allDates: string[] = [];
  isLoading = false;
  
  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private dateTimeService: DateTimeService,
    private uiService: UiService
  ) {
    addIcons({ closeOutline, calendarOutline, timeOutline, star });
  }

  ngOnInit() {
    const today = new Date();
    
    this.selectedDate = today.toISOString();
    
    this.loadAllFutureSlots();
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
    this.customerService.getAvailableSlots(this.trainer.id, this.dateTimeService.formatDateForAPI(startDate.toISOString())).subscribe({
      next: (slots) => {
        
        if (slots && Array.isArray(slots)) {
          // Raggruppa gli slot per data e filtra quelli precedenti alla data selezionata
          slots.forEach(slot => {
            if (!slot.start_time) {
              console.error('Slot senza start_time:', slot);
              return;
            }
            
            try {
              // Estrai la data dallo slot
              const slotDate = this.dateTimeService.formatDateForAPI(slot.start_time);
              const slotDateTime = new Date(slotDate);
              slotDateTime.setHours(0, 0, 0, 0);
              
              // Verifica che la data dello slot sia >= alla data selezionata
              if (slotDateTime >= startDate) {
                if (!this.slotsByDate[slotDate]) {
                  this.slotsByDate[slotDate] = [];
                  this.allDates.push(slotDate);
                }
                
                // Aggiungi proprietà con orari corretti
                slot.adjustedStartTime = this.dateTimeService.formatDateTime(slot.start_time);
                slot.adjustedStartTimeOnly = this.dateTimeService.formatTime(slot.start_time);
                slot.adjustedEndTime = this.dateTimeService.formatDateTime(slot.end_time);
                slot.adjustedEndTimeOnly = this.dateTimeService.formatTime(slot.end_time);

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
        this.uiService.showToast('Impossibile caricare gli slot disponibili', 2000, 'top', 'danger');
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
        this.uiService.showToast('Prenotazione effettuata con successo!', 2000, 'top', 'success');
        this.loadAllFutureSlots(); // Ricarica gli slot per aggiornare la disponibilità
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error booking slot:', error);
        
        let errorMessage = 'Errore durante la prenotazione. Riprova più tardi.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        this.uiService.showToast(errorMessage, 2000, 'top', 'danger');
      }
    });
  }

  // Utilizza il metodo del servizio
  formatDateForDisplay(dateString: string): string {
    return this.dateTimeService.formatDateForDisplay(dateString);
  }
}
