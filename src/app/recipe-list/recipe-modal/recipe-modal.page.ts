import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {

  //recipeName: string = "Recipe Name";
  //recipeDescription: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non aliquam lectus. Maecenas interdum, risus vel faucibus tristique, neque tortor tristique metus, quis dignissim orci enim vitae arcu. Vivamus vitae sodales elit, quis iaculis mi. Maecenas purus eros, ornare eu dolor sit amet, hendrerit ullamcorper neque. Aenean elit odio, malesuada vitae nulla nec, elementum efficitur purus. Phasellus nisl quam, aliquet in pulvinar a, ornare sit amet velit. Quisque vel rhoncus arcu. Fusce nec dolor sit amet risus elementum egestas.";
  //recipeIngredients: string[] = ['Ingredient 1', 'Ingredient 2'];

  addRecipeForm = this._formBuilder.group({
    recipeName: '',
    description: '',
    ingredients: '',
  })

  constructor(
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
  ) {
    
  }

  ngOnInit() {
  }

  onSubmitRecipe(f: FormGroup) {
    // Convert string of ingredients to string[] by ','
    let stringArray = f.get('ingredients').value.split(',');
    console.log("Debug Recipe Array: " + stringArray);
    //f.patchValue({'description' : 'fjaslkdfjasldfjasldf'});
    //console.log(f.get('recipeName').value);
    //console.log(f.setValue({'recipeName': 'Awesome recipe', 'description': 'Hello'}));
    let data = {
      "recipeName": f.get('recipeName').value,
    }
    this._modalController.dismiss(data);
    //console.log(f);
  }

  onDismiss() {
    this._modalController.dismiss();
    console.log("Dismissed");
  }

}
