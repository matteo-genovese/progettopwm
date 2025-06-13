import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UiService } from './ui.service';

interface LoginResponse {
  user?: any;
  data?: {
    email?: string;
    full_name?: string;
    id?: number;
    password?: string;
    role?: string;
    username?: string;
  };
  message?: string;
  status?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private uiService: UiService
  ) {
    // Controlla se c'è un token salvato nel localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        console.log('Auth service processing response:', response);
        if (response.data && response.status === 'success') {
          localStorage.setItem('auth_token', 'session_token_' + new Date().getTime());

          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          } else if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }

          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    
    this.clearAuthData();
    
    this.resetAppState();
    
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  private resetAppState() {
    window.dispatchEvent(new CustomEvent('app:reset'));
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  isCustomer(): boolean {
    const user = this.getUser();
    return user && user.role === 'customer';
  }

  isTrainer(): boolean {
    const user = this.getUser();
    return user && user.role === 'trainer';
  }

  logoutWithUI(): void {
    this.confirmLogout().then(confirmed => {
      if (confirmed) {
        this.performLogout();
      }
    });
  }
  
  private async confirmLogout(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Conferma logout',
        message: 'Sei sicuro di voler effettuare il logout?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
            handler: () => resolve(false)
          }, {
            text: 'Logout',
            handler: () => resolve(true)
          }
        ]
      });
  
      await alert.present();
    });
  }
  
  private performLogout(): void {
    this.logout().subscribe({
      next: () => {
        this.uiService.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.uiService.showToast('Logout effettuato con successo');
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  }
}
