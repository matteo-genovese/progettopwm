import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonChip,
  IonLabel,
  IonSkeletonText
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
import { CustomerService } from '../services/customer.service';

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
    IonList,
    IonItem,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
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
    private router: Router
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
}
