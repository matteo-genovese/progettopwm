import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

export interface DetailRow {
  icon: string;
  description: string;
  iconColor?: string;
}

@Component({
  selector: 'detail-card',
  template: `
    <ion-item>
        <ion-label>
            <p>{{ title }}</p>
            <div class="rows-container">
              @for (row of rows; track row) {
                <div class="row-container">
                  <ion-icon [name]="row.icon" color="primary" class="row-icon"></ion-icon>
                  <h3>{{ row.description }}</h3>
                </div>
              }
            </div>
            
            <!-- Bottone spostato dentro ion-label -->
            <div class="button-container" *ngIf="buttonText && buttonLink">
              <ion-button 
                class="app-button"
                expand="block" 
                [routerLink]="buttonLink"
                (click)="onButtonClick()">
                {{ buttonText }}
              </ion-button>
            </div>
        </ion-label>
    </ion-item>
  `,
  styles: [`
    ion-item {
      --padding-start: 0;
      --background: #ffffff;
      --border-color: #e0e0e0;
      --border-width: 1px;
      --border-radius: 8px;
      --min-height: auto;
      --ripple-color: transparent;
      margin: 8px 0; 
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: 1.8px solid #5f5555;

      &::part(native) {
        border-radius: 8px;
        padding: 8px 12px;
      }

      p {
        color: var(--ion-color-primary);
        font-size: 0.75rem;
        margin-bottom: 4px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      h3 {
        font-size: 1rem;
        margin: 0;
        color: #111;
      }

      ion-icon {
        font-size: 1.2rem;
        margin-right: 0.5rem;
        color: var(--ion-color-primary);
      }

      h3, p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }
    }

    .rows-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .row-container {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .row-container:last-child {
      margin-bottom: 0;
    }
        
    .row-icon {
      font-size: 1.2rem;
      margin-right: 8px;
      color: var(--ion-color-primary);
      flex-shrink: 0;
    }

    /* Stile per il container del bottone */
    .button-container {
      margin-top: 12px;
    }

    /* Stile per il bottone */
    .button-container ion-button {
      margin: 0;
      width: 100%;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonIcon, IonItem, IonLabel, IonButton, RouterLink]
})
export class DetailCardComponent {
  @Input() icon = 'information-circle-outline';
  @Input() title = '';
  @Input() description = '';
  @Input() rows: DetailRow[] = [];
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Output() buttonClicked = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClicked.emit();
  }
}