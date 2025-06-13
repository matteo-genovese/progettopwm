import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  status?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api';
  private isAuthenticated = false;
  public isAuthenticated$ = new Observable<boolean>(observer => {
	observer.next(this.isAuthenticated);
  });
  constructor(
	private http: HttpClient,
  ) {}

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
