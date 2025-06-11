import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonSpinner,
  IonText,
  IonSelect,
  IonSelectOption,
  IonList,
  IonBackButton,
  IonButtons,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  mailOutline,
  callOutline,
  cardOutline,
  fitnessOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

interface RegistrationData {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  specialization?: string;  // Proprietà opzionale
  max_clients_per_slot?: number;  // Proprietà opzionale
  trainer_id?: number | null;  // Proprietà opzionale
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonSpinner,
    IonText,
    IonSelect,
    IonSelectOption,
    IonList  
  ]
})
export class RegisterPage {
  userData: RegistrationData = {
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone: '',
    role: 'customer', // Default role
    specialization: 'Fitness', // Default specialization per trainer
    max_clients_per_slot: 1, // Default max clients per slot
    trainer_id: null // Default trainer_id for customer
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  availableTrainers: any[] = [];
  isLoadingTrainers = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      personOutline,
      lockClosedOutline,
      mailOutline,
      callOutline,
      cardOutline,
      fitnessOutline
    });
  }

  onRoleChange() {
    // Carica i trainer disponibili se l'utente seleziona "customer"
    if (this.userData.role === 'customer') {
      this.loadAvailableTrainers();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  loadAvailableTrainers() {
    this.isLoadingTrainers = true;
    // Assumiamo che esista un metodo nel servizio per ottenere i trainer
    this.authService.getAllTrainers().subscribe({
      next: (trainers) => {
        this.availableTrainers = trainers;
        this.isLoadingTrainers = false;
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.isLoadingTrainers = false;
      }
    });
  }

  async onRegister() {
    // Reset error message
    this.errorMessage = '';

    // Validate form
    if (this.validateForm()) {
      this.isLoading = true;
      
      // Copia i dati di base sempre necessari
      let registrationData: RegistrationData = {
        username: this.userData.username,
        password: this.userData.password,
        email: this.userData.email,
        full_name: this.userData.full_name,
        phone: this.userData.phone,
        role: this.userData.role
      };

      // Aggiungi le proprietà specifiche in base al ruolo
      if (this.userData.role === 'trainer') {
        registrationData.specialization = this.userData.specialization;
        registrationData.max_clients_per_slot = this.userData.max_clients_per_slot;
      } else if (this.userData.role === 'customer') {
        registrationData.trainer_id = this.userData.trainer_id || null;
      }

      this.authService.register(registrationData).subscribe({
        next: async (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);

          await this.showSuccessAlert();
          // Redirect to login page
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);

          if (error.status === 0) {
            this.errorMessage = 'Impossibile connettersi al server';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Dati di registrazione non validi';
          } else if (error.status === 409) {
            this.errorMessage = 'Username o email già esistente';
          } else {
            this.errorMessage = error.error?.message || 'Si è verificato un errore durante la registrazione';
          }
        }
      });
    }
  }

  validateForm(): boolean {
    // Check required fields
    if (!this.userData.username || !this.userData.password || !this.userData.email ||
      !this.userData.full_name || !this.userData.phone) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return false;
    }

    // Check password
    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non corrispondono';
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.errorMessage = 'Formato email non valido';
      return false;
    }

    // Check phone format (simple validation for numbers and common separators)
    const phoneRegex = /^[0-9\+\-\s\(\)\.]+$/;
    if (!phoneRegex.test(this.userData.phone)) {
      this.errorMessage = 'Formato numero di telefono non valido';
      return false;
    }

    // Validazione campi specifici per ruolo
    if (this.userData.role === 'trainer') {
      if (!this.userData.specialization) {
        this.errorMessage = 'Seleziona una specializzazione';
        return false;
      }
      if (!this.userData.max_clients_per_slot || this.userData.max_clients_per_slot < 1) {
        this.errorMessage = 'Inserisci un numero valido di clienti massimi per slot';
        return false;
      }
    }

    return true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Registrazione completata',
      message: 'Il tuo account è stato creato con successo. Ora puoi accedere con le tue credenziali.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
