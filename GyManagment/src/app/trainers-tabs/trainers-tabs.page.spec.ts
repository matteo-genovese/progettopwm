import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainersTabsPage } from './trainers-tabs.page';

describe('TrainersTabsPage', () => {
  let component: TrainersTabsPage;
  let fixture: ComponentFixture<TrainersTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
