import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { RecipeServiceService } from './recipe-service.service';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  constructor(private _popoverController: PopoverController,
              private _recipeService: RecipeServiceService,  
  ) { }

  onSort(event: any, componentProps?: any) {
    // In order to position the popover relative to the element clicked, a click event needs to be passed into the options of the the present method.
    this.presentPopover(event, componentProps);
  }

  async presentPopover(event: any, componentProps?: any) {
    console.log("Creating popover");
    const popover = await this._popoverController.create({
      component: PopoverComponent,
      event: event,
      showBackdrop: false,
    });
    await popover.present();
    await popover.onDidDismiss().then(data => {
      console.log("Dismissed popover");
      console.log("Sorting by: " + data.data);

      // Sort the recipe list here
      if (data != null || data != undefined) {
        this._recipeService.sortBy(data.data);
      }
    });
  }
}
