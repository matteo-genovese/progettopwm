import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  // Mappa che contiene gli Observable per ogni pagina dell'applicazione
  private refreshSubjects = new Map<string, Subject<void>>();
  
  /**
   * Ottiene un Observable per una specifica pagina
   * @param pageId Identificatore unico della pagina (es. 'trainer-dashboard')
   * @returns Observable che emette quando la pagina deve aggiornarsi
   */
  getRefreshObservable(pageId: string): Observable<void> {
    if (!this.refreshSubjects.has(pageId)) {
      this.refreshSubjects.set(pageId, new Subject<void>());
    }
    return this.refreshSubjects.get(pageId)!.asObservable();
  }
  
  /**
   * Notifica a una specifica pagina che deve aggiornarsi
   * @param pageId Identificatore della pagina da aggiornare
   */
  refreshPage(pageId: string): void {
    if (this.refreshSubjects.has(pageId)) {
      this.refreshSubjects.get(pageId)!.next();
    }
  }
  
  /**
   * Notifica a tutte le pagine di aggiornarsi
   */
  refreshAll(): void {
    this.refreshSubjects.forEach(subject => subject.next());
  }
}