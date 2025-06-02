import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

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

interface ApiResponse<T> {
  data: T[];
  status: string;
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
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(error => {
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

  getAllTrainers(): Observable<any[]> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/admin/trainers`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching trainers:', error);
        return throwError(() => error);
      })
    );
  }

  getAllCustomers(): Observable<any[]> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/admin/customers`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching customers:', error);
        return throwError(() => error);
      })
    );
  }
}
