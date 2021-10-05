import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private toastService: ToastController) {}

  async SimplePopup(
    popupMessage: string,
    popupDuration: number,
    color: string
  ) {
    (
      await this.toastService.create({
        message: popupMessage,
        duration: popupDuration,
        color: color,
      })
    ).present();
  }
}
