import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-container ion-text-center">
      <ion-spinner name="crescent"></ion-spinner>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    p {
      margin-top: 1rem;
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonSpinner]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Caricamento...';
}
