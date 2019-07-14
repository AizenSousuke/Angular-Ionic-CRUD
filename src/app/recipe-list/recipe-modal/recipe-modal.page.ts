import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {

  recipeName: string = "Recipe Name";
  recipeDescription: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non aliquam lectus. Maecenas interdum, risus vel faucibus tristique, neque tortor tristique metus, quis dignissim orci enim vitae arcu. Vivamus vitae sodales elit, quis iaculis mi. Maecenas purus eros, ornare eu dolor sit amet, hendrerit ullamcorper neque. Aenean elit odio, malesuada vitae nulla nec, elementum efficitur purus. Phasellus nisl quam, aliquet in pulvinar a, ornare sit amet velit. Quisque vel rhoncus arcu. Fusce nec dolor sit amet risus elementum egestas.";
  recipeIngredients: string[] = ['Ingredient 1', 'Ingredient 2'];

  constructor(private _modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  onSubmit(name: string, ingredients: string[], description?: string) {
    console.log("Submitted");
  }

  onDismiss() {
    this._modalController.dismiss();
    console.log("Dismissed");
  }

}
