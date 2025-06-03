import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabs, IonTabButton, IonLabel, IonIcon, IonTabBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-trainer-tabs',
  templateUrl: './trainer-tabs.page.html',
  styleUrls: ['./trainer-tabs.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonIcon, IonLabel, IonTabButton, IonTabs, CommonModule, FormsModule]
})
export class TrainersTabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
