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

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
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
    IonButtons
  ]
})
export class RegisterPage {
  userData = {
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone: '',
    role: 'customer' // Default role
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

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

  async onRegister() {
    // Reset error message
    this.errorMessage = '';

    // Validate form
    if (this.validateForm()) {
      this.isLoading = true;

      this.authService.register(this.userData).subscribe({
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

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
