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
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, calendarOutline, timeOutline, star } from 'ionicons/icons';
import { CustomerService } from '../../services/customer.service';

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
    IonText
  ]
})
export class SlotsModalComponent implements OnInit {
  @Input() trainer: any;
  
  // Inizializzare le proprietà con valori di default
  selectedDate: string = '';
  minDate: string = '';
  availableSlots: any[] = [];
  isLoading = false;
  
  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    // Inizializza le date dopo che il browser è pronto
    setTimeout(() => {
      this.selectedDate = new Date().toISOString();
      this.minDate = new Date().toISOString();
    });
    addIcons({ closeOutline, calendarOutline, timeOutline, star });
  }

  ngOnInit() {
    // Assicurati che le date siano inizializzate
    if (!this.selectedDate) {
      this.selectedDate = new Date().toISOString();
      this.minDate = new Date().toISOString();
    }
    this.loadSlots();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  loadSlots() {
    if (!this.trainer || !this.trainer.id) return;
    
    this.isLoading = true;
    const formattedDate = this.formatDate(this.selectedDate);
    
    this.customerService.getAvailableSlots(this.trainer.id, formattedDate).subscribe({
      next: (slots) => {
        this.availableSlots = slots;
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
    this.loadSlots();
  }

  bookSlot(slotId: number) {
    this.isLoading = true;
    
    this.customerService.bookSession(slotId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showToast('Prenotazione effettuata con successo!', 'success');
        this.loadSlots(); // Ricarica gli slot per aggiornare la disponibilità
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error booking slot:', error);
        this.showToast('Errore durante la prenotazione. Riprova più tardi.', 'danger');
      }
    });
  }

  private formatDate(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
