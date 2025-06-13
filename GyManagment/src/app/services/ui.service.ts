import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}
  
  async showConfirmation(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
            handler: () => resolve(false)
          }, {
            text: 'Conferma',
            handler: () => resolve(true)
          }
        ]
      });
  
      await alert.present();
    });
  }
  
  async showToast(message: string, duration = 2000, position: 'top' | 'bottom' | 'middle' = 'top', color = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color
    });
    toast.present();
  }
}
