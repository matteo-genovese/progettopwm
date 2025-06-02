import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fitnessOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    addIcons({ fitnessOutline });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  async onLogin() {
    console.log('Login attempt with:', this.credentials);

    if (!this.credentials.username || !this.credentials.password) {
      this.showError('Inserisci username e password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.authService.login(this.credentials.username, this.credentials.password)
        .subscribe({
          next: async (response) => {
            console.log('Login response:', response);
            this.isLoading = false;

            if (response.data && response.status === 'success') {
              await this.showSuccess('Login effettuato con successo!');

              if (this.authService.isLoggedIn()) {
                this.redirectBasedOnRole();
              } else {
                console.log('Autenticazione non rilevata, impossibile navigare');
              }
            } else {
              this.showError(response.message || 'Credenziali non valide');
            }
          },
          error: async (error) => {
            console.error('Login error:', error);
            this.isLoading = false;

            let errorMsg = 'Errore durante il login';
            if (error.status === 401) {
              errorMsg = 'Username o password non validi';
            } else if (error.status === 0) {
              errorMsg = 'Impossibile connettersi al server';
            } else if (error.error?.message) {
              errorMsg = error.error.message;
            }

            this.showError(errorMsg);
          }
        });
    } catch (error) {
      this.isLoading = false;
      console.error('Unexpected error:', error);
      this.showError('Errore imprevisto durante il login');
    }
  }

  async demoLogin() {
    this.credentials = {
      username: 'newuser',
      password: 'password123'
    };

    await this.onLogin();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private async showSuccess(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  private redirectBasedOnRole() {
    // Prendi il returnUrl se presente nei parametri query
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];

    if (this.authService.isAdmin()) {
      console.log('Admin user detected, navigating...');
      this.router.navigateByUrl(returnUrl || '/admin/dashboard', { replaceUrl: true });
    } else if (this.authService.isCustomer()) {
      console.log('Customer user detected, navigating...');
      this.router.navigateByUrl(returnUrl || '/customer/dashboard', { replaceUrl: true });
    } else if (this.authService.isTrainer()) {
      console.log('Trainer user detected, navigating...');
      // Quando avrai creato la dashboard del trainer, usa:
      // this.router.navigateByUrl(returnUrl || '/trainer/dashboard', { replaceUrl: true });
      this.router.navigateByUrl('/home', { replaceUrl: true });
      this.showError('Area Trainer in sviluppo');
    } else {
      console.log('Unknown role, navigating to home...');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }
}
