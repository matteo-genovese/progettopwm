import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
	token?: string;
	access_token?: string;
	user?: any;
	message?: string;
	data?: {
	  status?: string;
	  email?: string;
	  full_name?: string;
	  id?: number;
	  password?: string;
	  role?: string;
	  username?: string;
	  message?: string;
	};
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
    private router: Router
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
        
        // Modificata la condizione per riconoscere un login riuscito
        if (response.token || response.access_token || 
            (response.data && (response.data.status === 'success' || response.data.username || response.data.email))) {
          
          // Se c'è un token, usalo
          if (response.token || response.access_token) {
            const token = response.token || response.access_token;
            localStorage.setItem('auth_token', token!);
          } else if (response.data) {
            // Altrimenti usa un token fittizio per questa sessione
            localStorage.setItem('auth_token', 'session_token_' + new Date().getTime());
          }
          
          // Salva i dati utente
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          } else if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          
          this.isAuthenticatedSubject.next(true);
          
          // Naviga direttamente alle tabs
          setTimeout(() => {
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          }, 100);
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
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(error => {
        // Anche se la chiamata fallisce, pulisci il localStorage
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
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
}
