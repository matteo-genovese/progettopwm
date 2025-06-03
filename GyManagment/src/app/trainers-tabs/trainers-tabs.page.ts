import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonTabButton, IonLabel, IonIcon, IonTabBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-trainers-tabs',
  templateUrl: './trainers-tabs.page.html',
  styleUrls: ['./trainers-tabs.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonIcon, IonLabel, IonTabButton, IonTabs, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TrainersTabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
