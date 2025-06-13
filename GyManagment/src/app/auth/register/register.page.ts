import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon, IonSpinner, 
  IonText, IonSelect, IonSelectOption, IonList, ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, lockClosedOutline, mailOutline, callOutline, cardOutline, fitnessOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

interface RegistrationData {
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  specialization?: string;
  max_clients_per_slot?: number;
  trainer_id?: number | null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonButton, IonItem, IonLabel, 
    IonInput, IonIcon, IonSpinner, IonText, IonSelect, IonSelectOption, IonList  
  ]
})

export class RegisterPage {
  userData: RegistrationData = {
    username: '',
    password: '',
    email: '',
    full_name: '',
    phone: '',
    role: 'customer', 
    specialization: 'Fitness', 
    max_clients_per_slot: 1, 
    trainer_id: null 
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({
      personOutline, lockClosedOutline, mailOutline, callOutline, cardOutline, fitnessOutline
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async onRegister() {
    this.errorMessage = '';

    if (this.validateForm()) {
      this.isLoading = true;
      
      let registrationData: RegistrationData = {
        username: this.userData.username,
        password: this.userData.password,
        email: this.userData.email,
        full_name: this.userData.full_name,
        phone: this.userData.phone,
        role: this.userData.role
      };

      if (this.userData.role === 'trainer') {
        registrationData.specialization = this.userData.specialization;
      }

      this.authService.register(registrationData).subscribe({
        next: async (response) => {
          this.isLoading = false;

          await this.showSuccessAlert();
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

    /*
    // Controllo se tutti i dati sono stati inseriti
    if (!this.userData.username || !this.userData.password || !this.userData.email ||
      !this.userData.full_name || !this.userData.phone) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return false;
    }
    */

    // Controllo se le password sono corrette
    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non corrispondono';
      return false;
    }

    // Controlla il formato della mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.errorMessage = 'Formato email non valido';
      return false;
    }

    // Controlla il formato del numero di telefono
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
}
