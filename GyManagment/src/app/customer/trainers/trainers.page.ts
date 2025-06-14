import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonCard, IonCardContent, IonButton, IonIcon, 
  IonRefresher, IonRefresherContent, IonChip, IonLabel, IonSkeletonText, ModalController, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  fitnessOutline, starOutline, calendarOutline, personOutline, searchOutline
} from 'ionicons/icons';
import { CustomerService } from '../../services/customer.service';
import { SlotsModalComponent } from '../components/slots-modal/slots-modal.component';
import { AuthService } from '../../services/auth.service';
import { AppHeaderComponent } from 'src/app/shared/components/app-header/app-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonSearchbar, IonCard, IonCardContent, IonButton, IonIcon, IonRefresher, 
    IonRefresherContent, IonChip, IonLabel, IonSkeletonText, IonButtons, IonBackButton,
    AppHeaderComponent, LoadingSpinnerComponent
  ]
})
export class TrainersPage implements OnInit {
  trainers: any[] = [];
  filteredTrainers: any[] = [];
  isLoading = false;
  searchTerm = '';
  filters = {
    specialization: 'all'
  };

  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private authService: AuthService,
  ) {
    addIcons({ fitnessOutline, starOutline, calendarOutline, personOutline, searchOutline });
  }

  ngOnInit() {
    this.loadTrainers();
  }

  ionViewWillEnter() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.isLoading = true;
    this.customerService.getAvailableTrainers().subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
        this.isLoading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.loadTrainers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  applyFilters() {
    this.filteredTrainers = this.trainers.filter(trainer => {
      const matchesSearch = this.searchTerm ? 
        trainer.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) :
        true;
      
      const matchesSpecialization = this.filters.specialization === 'all' || 
        trainer.specialization === this.filters.specialization;
      
      return matchesSearch && matchesSpecialization;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  setSpecializationFilter(specialization: string) {
    this.filters.specialization = specialization;
    this.applyFilters();
  }

  async openSlotsModal(trainer: any) {
    const modal = await this.modalCtrl.create({
      component: SlotsModalComponent,
      componentProps: {
        trainer: trainer
      }
    });

    await modal.present();
  }

  onLogout() {
    this.authService.logoutWithUI();
  }
}
