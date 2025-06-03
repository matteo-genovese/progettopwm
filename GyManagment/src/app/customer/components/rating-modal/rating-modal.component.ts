import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonTextarea,
  ModalController,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, starOutline, star } from 'ionicons/icons';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonTextarea,
    IonIcon
  ]
})
export class RatingModalComponent {
  @Input() trainerId!: number;
  rating: number = 0;
  comment: string = '';
  isSubmitting = false;

  constructor(
    private modalCtrl: ModalController,
    private customerService: CustomerService
  ) {
    addIcons({ closeOutline, starOutline, star });
  }

  close() {
    this.modalCtrl.dismiss({
      rated: false
    });
  }

  submitRating() {
    if (this.rating <= 0) {
      return;
    }

    this.isSubmitting = true;
	this.customerService.rateTrainer(this.trainerId, this.rating, this.comment).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.modalCtrl.dismiss({
          rated: true,
          rating: this.rating
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting rating:', error);
      }
    });
  }

  getStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({
        filled: i <= this.rating,
        value: i
      });
    }
    return stars;
  }

  setRating(value: number) {
    this.rating = value;
  }
}
