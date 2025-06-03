import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlotsPage } from './slots.page';

describe('SlotsPage', () => {
  let component: SlotsPage;
  let fixture: ComponentFixture<SlotsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
