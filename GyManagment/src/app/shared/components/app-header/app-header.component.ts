import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBackButton } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBackButton
  ]
})
export class AppHeaderComponent {
  @Input() title = '';
  @Input() showBackButton = true;
  @Input() backHref = '/';
  @Input() showLogout = true;

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logoutWithUI();
  }
}
