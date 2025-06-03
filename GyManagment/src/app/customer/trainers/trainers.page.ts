import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonLabel,
  IonSkeletonText,
  ModalController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  fitnessOutline, 
  starOutline, 
  calendarOutline, 
  personOutline,
  searchOutline
} from 'ionicons/icons';
import { CustomerService } from '../../services/customer.service';
import { SlotsModalComponent } from '../components/slots-modal/slots-modal.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.page.html',
  styleUrls: ['./trainers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonLabel,
    IonSkeletonText
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
    private router: Router,
    private modalCtrl: ModalController
  ) {
    addIcons({ fitnessOutline, starOutline, calendarOutline, personOutline, searchOutline });
  }

  ngOnInit() {
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

  viewTrainerDetail(trainerId: number) {
    this.router.navigate(['/customer/trainers', trainerId]);
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
}
