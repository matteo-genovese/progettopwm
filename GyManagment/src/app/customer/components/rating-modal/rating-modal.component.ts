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
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { CustomerService } from '../../../services/customer.service';
import { addIcons } from 'ionicons';
import { closeOutline, starOutline, star } from 'ionicons/icons';

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
    private toastController: ToastController,
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
    console.log("trainer id " + this.trainerId);
    this.customerService.rateTrainer(this.trainerId, this.rating, this.comment).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.modalCtrl.dismiss({
            rated: true,
            rating: this.rating
          });
          this.showToast('Valutazione salvata con successo', 'success');
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting rating:', error);
          this.showToast(error, 'danger');
        }
      });
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  getStars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({
        value: i,
        filled: i <= this.rating
      });
    }
    return stars;
  }

  setRating(value: number) {
    this.rating = value;
  }
}
