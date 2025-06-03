import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular/standalone';
import { RatingModalComponent } from '../components/rating-modal/rating-modal.component';

interface ApiResponse<T> {
  data: T;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController
  ) { }

  getCustomerDashboard(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/customer/dashboard`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        return throwError(() => error);
      })
    );
  }

  getAvailableTrainers(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/customer/trainers`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching trainers:', error);
        return throwError(() => error);
      })
    );
  }

  getAvailableSlots(trainerId: number, date: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/customer/slots?trainer_id=${trainerId}`
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error(`Error fetching slots for trainer ${trainerId}:`, error);
        return throwError(() => error);
      })
    );
  }

  bookSession(slotId: number): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/customer/book`, { 
      slot_id: slotId 
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error booking session:', error);
        return throwError(() => error);
      })
    );
  }

  rateTrainer(trainerId: number, rating: number, review: string = ''): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/customer/rate`, { 
      trainer_id: trainerId,
      rating,
      review
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error rating trainer ${trainerId}:`, error);
        return throwError(() => error);
      })
    );
  }

  async openRatingModal(trainerId: number) {
    const modal = await this.modalCtrl.create({
      component: RatingModalComponent,
      componentProps: {
        trainerId
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.rated) {
      return true;
    }
    return false;
  }
}
