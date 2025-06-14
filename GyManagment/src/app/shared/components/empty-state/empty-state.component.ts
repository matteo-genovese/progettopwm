import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <ion-icon [name]="icon" [color]="iconColor" size="large"></ion-icon>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      
      <!-- Bottone con routerLink se specificato -->
      @if (buttonText && buttonLink) {
        <ion-button 
          class= "app-button" 
          expand="block" 
          [routerLink]="buttonLink">
          {{ buttonText }}
        </ion-button>
      }
      
      <!-- Bottone con event handler se non c'è link ma c'è un handler -->
      @if (buttonText && !buttonLink) {
        <ion-button
        class= "app-button"  
        expand="block" 
        (click)="onButtonClick()">
        {{ buttonText }}
        </ion-button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem 1rem;
      margin: 1rem auto;
    }
    
    ion-icon {
      font-size: 48px;
      color: var(--ion-color-medium);
      margin-bottom: 1rem;
    }
    
    h3 {
      margin: 0 0 0.5rem;
      font-weight: 600;
      color: var(--ion-color-dark);
    }
    
    p {
      margin: 0 0 1.5rem;
      color: var(--ion-color-medium);
    }
    
    ion-button {
      max-width: 300px;
      margin: 0 auto;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButton, RouterLink]
})
export class EmptyStateComponent {
  @Input() icon = 'information-circle-outline';
  @Input() iconColor = 'medium';
  @Input() title = 'Nessun dato disponibile';
  @Input() description = '';
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Output() buttonClicked = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClicked.emit();
  }
}
