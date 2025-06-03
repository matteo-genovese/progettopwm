import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private baseUrl = 'http://localhost:5000/api/trainer';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard`).pipe(
      map(res => res.data), // <-- usa sempre .data
      catchError(this.handleError)
    );
  }

  getSchedule(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/schedule`).pipe(
      map(res => res.data), // <-- usa sempre .data
      catchError(this.handleError)
    );
  }

  createSlot(slot: { start_time: string, end_time: string, max_clients: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/schedule`, slot).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('TrainerService error:', error);
    return throwError(() => error);
  }
}