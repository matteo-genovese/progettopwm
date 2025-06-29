import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon, IonSpinner, 
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fitnessOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonItem, IonLabel, IonInput, IonIcon, 
    IonSpinner, IonText, CommonModule, FormsModule, RouterLink
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
    private route: ActivatedRoute,
    private uiService: UiService
  ) {
    addIcons({ fitnessOutline });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  async onLogin() {
    if (!this.credentials.username || !this.credentials.password) {
      this.showError('Inserisci username e password');
      return;
    }

    this.isLoading = true;

    try {
      this.authService.login(this.credentials.username, this.credentials.password)
        .subscribe({
          next: async (response) => {
            this.isLoading = false;

            if (response.data && response.status === 'success') {
              await this.uiService.showToast('Login effettuato con successo!', 2000, 'top', 'success');

              if (this.authService.isLoggedIn()) {
                this.redirectBasedOnRole();
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

  goBack() {
    this.router.navigate(['/home']);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private redirectBasedOnRole() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];

    // Determine the destination based on role
    let destination: string;
    if (this.authService.isAdmin()) {
      destination = returnUrl || '/admin/dashboard';
    } else if (this.authService.isCustomer()) {
      destination = returnUrl || '/customer/dashboard';
    } else if (this.authService.isTrainer()) {
      destination = returnUrl || '/trainer/dashboard';
    } else {
      destination = '/home';
    }

    // Navigate with page reload to ensure a clean state
    window.location.href = destination;
  }
}
