import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RefreshService } from '../../../services/refresh.service';

@Directive()
export abstract class RefreshablePage implements OnInit, OnDestroy {
  private refreshSubscription?: Subscription;
  
  // ID univoco della pagina - da implementare nelle classi derivate
  protected abstract pageId: string;
  
  constructor(protected refreshService: RefreshService) {}
  
  ngOnInit() {
    // Sottoscrivi agli eventi di aggiornamento specifici per questa pagina
    this.refreshSubscription = this.refreshService
      .getRefreshObservable(this.pageId)
      .subscribe(() => {
        this.loadData();
      });
  }
  
  ngOnDestroy() {
    // Pulizia della sottoscrizione quando il componente viene distrutto
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  ionViewWillEnter() {
    // Carica i dati ogni volta che la pagina viene visualizzata
    this.loadData();
  }
  
  // Metodo astratto che le classi derivate devono implementare
  protected abstract loadData(): void;
}