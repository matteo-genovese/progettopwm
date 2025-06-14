import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'detail-card',
  template: `
    <ion-item>
        <ion-icon name="{{ icon }}" slot="start" color="primary"></ion-icon>
        <ion-label>
            <p>{{ title }}</p>
            <h3>{{ description }}</h3>
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
  min-width: 140px; 
  max-width: 320px; 
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
  `],
  standalone: true,
  imports: [CommonModule, IonIcon, IonItem, IonLabel]
})
export class DetailCardComponent {
  @Input() icon = 'information-circle-outline';
  @Input() title = '';
  @Input() description = '';
}
