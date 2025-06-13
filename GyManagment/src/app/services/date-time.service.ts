import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  
  constructor() { }

  /**
   * Aggiusta il fuso orario aggiungendo 2 ore
   * @param dateString La stringa della data da aggiustare
   * @returns Una nuova data con il fuso orario corretto
   */
  adjustTimeZone(dateString: string): Date {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2);
    return date;
  }

  /**
   * Formatta la data completa (data e ora) con correzione del fuso orario
   * @param dateString La stringa della data da formattare
   * @returns La data formattata come stringa
   */
  formatDateTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatta solo la parte della data con correzione del fuso orario
   * @param dateString La stringa della data da formattare
   * @returns La data formattata come stringa
   */
  formatDate(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formatta solo la parte dell'ora con correzione del fuso orario
   * @param dateString La stringa della data da formattare
   * @returns L'ora formattata come stringa
   */
  formatTime(dateString: string): string {
    const date = this.adjustTimeZone(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Combina una data e un'ora in una stringa formattata
   * @param date La data
   * @param time L'ora
   * @returns La data e ora combinate in formato stringa
   */
  combineDateTime(date: string | null, time: string | null): string {
    if (!date || !time) return '';
    
    const d = new Date(date);
    const t = new Date(time);
    
    d.setHours(t.getHours() - 2, t.getMinutes(), 0, 0);
    
    return d.getFullYear() + '-' + 
           String(d.getMonth() + 1).padStart(2, '0') + '-' + 
           String(d.getDate()).padStart(2, '0') + ' ' + 
           String(d.getHours()).padStart(2, '0') + ':' + 
           String(d.getMinutes()).padStart(2, '0') + ':00';
  }

  /**
   * Formatta una data ISO in formato YYYY-MM-DD per le API
   * @param isoString La data in formato ISO
   * @returns La data in formato YYYY-MM-DD
   */
  formatDateForAPI(isoString: string): string {
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  /**
   * Formatta una data per la visualizzazione con giorno della settimana
   * @param dateString La stringa della data
   * @returns La data formattata con giorno della settimana
   */
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('it-IT', options);
  }
}
