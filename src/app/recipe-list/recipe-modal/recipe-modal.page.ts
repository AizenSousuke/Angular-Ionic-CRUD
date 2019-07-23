import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from "@angular/forms";
import { RecipeServiceService } from 'src/app/recipe-service.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {

  //recipeName: string = "Recipe Name";
  //recipeDescription: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non aliquam lectus. Maecenas interdum, risus vel faucibus tristique, neque tortor tristique metus, quis dignissim orci enim vitae arcu. Vivamus vitae sodales elit, quis iaculis mi. Maecenas purus eros, ornare eu dolor sit amet, hendrerit ullamcorper neque. Aenean elit odio, malesuada vitae nulla nec, elementum efficitur purus. Phasellus nisl quam, aliquet in pulvinar a, ornare sit amet velit. Quisque vel rhoncus arcu. Fusce nec dolor sit amet risus elementum egestas.";
  //recipeIngredients: string[] = ['Ingredient 1', 'Ingredient 2'];

  // Get the latest ID to use
  @Input() id: number;

  addRecipeForm = this._formBuilder.group({
    recipeName: '',
    imageLink: '',
    description: '',
    ingredients: '',
    timeNeeded: '',
    favourite: '',
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
    //let stringArray = f.get('ingredients').value.split(',');
    //console.log("Debug Recipe Array: " + stringArray);
    //f.patchValue({'description' : 'fjaslkdfjasldfjasldf'});
    //console.log(f.get('recipeName').value);
    //console.log(f.setValue({'recipeName': 'Awesome recipe', 'description': 'Hello'}));
    let data = {
      "id": this.id,
      "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
      "name": f.get('recipeName').value,
      "description": f.get('description').value,
      "ingredients": f.get('ingredients').value.split(','),
      "timeNeeded": f.get('timeNeeded').value,
      "favourite": f.get('favourite').value,
    }
    this._modalController.dismiss(data);
    //console.log(f);
  }

  onDismiss() {
    this._modalController.dismiss();
    console.log("Dismissed");
  }

}
