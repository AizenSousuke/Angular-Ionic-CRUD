import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {

  recipeName: string = "Recipe Name";

  constructor(private _modalController: ModalController) { }

  ngOnInit() {
  }

  onSubmit(name: string, ingredients: string[], description?: string) {
    
  }

  onDismiss() {
    this._modalController.dismiss();
  }

}
