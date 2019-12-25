import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  isLoading = false;

  constructor(private loadingController: LoadingController) { }

  async presentLoading(message?: string, duration?: number, translucent: boolean = false) {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: message,
      duration: duration,
      spinner: 'crescent',
      translucent: translucent,
      cssClass: 'custom-loading-css',
    });
    
    loading.present().then(() => {
      console.log("Loading presented");
      if (!this.isLoading) {
        // Dismiss if not loading anymore
        loading.dismiss().then(() => {
          console.log("Loading dismissed");
        }).catch(error => {
          console.log("Error: " + error);
        });
      }
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {
      console.log("Loading dismissed");
    }).catch(error => {
      console.log("Error: " + error);
    });
  }
}
