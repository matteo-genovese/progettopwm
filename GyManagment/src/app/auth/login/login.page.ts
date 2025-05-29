import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  LoadingController,
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
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({ fitnessOutline });
  }

  ngOnInit() {
    // Se l'utente è già loggato, reindirizza alle tabs
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tabs']);
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
            
            // Modifica la condizione per considerare anche response.data esistente
            if (response.token || response.access_token || 
                (response.data && (response.data?.status === 'success' || response.data?.username))) {
              console.log('Login successful, navigating to tabs...');
              await this.showSuccess('Login effettuato con successo!');
              
              setTimeout(() => {
                console.log('Verifica autenticazione prima del redirect:', this.authService.isLoggedIn());
                if (this.authService.isLoggedIn()) {
                  console.log('Navigando alle tabs...');
                  this.router.navigateByUrl('/tabs', { replaceUrl: true });
                } else {
                  console.log('Autenticazione non rilevata, impossibile navigare');
                }
              }, 500);
            } else {
				console.log('value of response.token:', response.token);
				console.log('value of response.access_token:', response.access_token);
				console.log('value of response.data:', response.data);
				console.log('value of response.data.status:', response.data?.status);
              console.log('Login failed:', response);
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
    // Imposta le credenziali demo
    this.credentials = {
      username: 'newuser',
      password: 'password123'
    };
    
    // Chiamata al metodo di login esistente
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
}
