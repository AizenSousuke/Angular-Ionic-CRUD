import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {
  // Get the latest ID to use
  @Input() id: number;

  @Input() recipe: Recipe;
  @Input() name: string = "";
  @Input() imageLink: string = "";
  @Input() description: string = "";
  @Input() ingredients: string[] = [""];
  @Input() timeNeeded: number = 0;
  @Input() favourite: boolean = false;

  addRecipeForm : FormGroup = this._formBuilder.group({
    recipeName: [''],
    imageLink: [''],
    description: [''],
    ingredients: [''],
    timeNeeded: [''],
    favourite: [''],
  });

  constructor(
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
    private _angularFireStore: AngularFirestore,
  ) {
    
  }

  ngOnInit() {
    if (this.name == null || this.name == "") {
      // If there is no name passed to the modal, assume that it was triggered from add recipe button and prefill stuffs
      console.log("Name is null");
      this.addRecipeForm.get('imageLink').setValue('https://cdn.auth0.com/blog/get-started-ionic/logo.png');
      this._angularFireStore.collection('recipe-list').ref.get().then(recipe => {
        this.id = recipe.size + 1;
        console.log('ID in modal set to: ' + this.id);
      });
      
      // Set default values because @Input of type boolean doesn't provide a value (undefined)
      this.favourite = false;
    } else {
      // Prefill the values
      this.prefillValues(this.recipe);
    }
  }

  prefillValues(recipe: Recipe) {
    console.log("---------------------");
    console.log(this.recipe);
    console.log(this.id);
    console.log(this.name);
    console.log(this.imageLink);
    console.log(this.description);
    console.log(this.ingredients);
    console.log(this.timeNeeded);
    console.log(this.favourite);
    console.log("---------------------");
    /*
    this.addRecipeForm.get('recipeName').setValue(this.name);
    this.addRecipeForm.get('imageLink').setValue(this.imageLink);
    this.addRecipeForm.get('description').setValue(this.description);
    this.addRecipeForm.get('ingredients').setValue(this.ingredients);
    this.addRecipeForm.get('timeNeeded').setValue(this.timeNeeded);
    this.addRecipeForm.get('favourite').setValue(this.favourite);
    */
    this.addRecipeForm.patchValue({
      'recipeName': this.name,
      'imageLink': this.imageLink,
      'description': this.description,
      'ingredients': this.ingredients,
      'timeNeeded': this.timeNeeded,
      'favourite': this.favourite,
    });

    this.addRecipeForm.get('favourite').patchValue('true');
  }

  onSubmitRecipe(f: FormGroup) {
    // Convert string of ingredients to string[] by ','
    console.log('ID in modal before submitting is: ' + this.id);
    let data = {
      "id": this.id,
      "imageLink": f.get('imageLink').value,
      "name": f.get('recipeName').value,
      "description": f.get('description').value,
      "ingredients": f.get('ingredients').value, //.split(','), // TODO: Fix error here when editing and then submitting recipe
      "timeNeeded": f.get('timeNeeded').value,
      "favourite": f.get('favourite').value,
    }
    console.log("Data: ");
    console.log(data);
    this._modalController.dismiss(data);
    //console.log(f);
  }

  onDismiss() {
    this._modalController.dismiss();
    console.log("Dismissed modal without data");
  }

  onDebugForm(f: FormGroup) {
    /*
    f.get('favourite').valueChanges.subscribe(event => {
      console.log(event);
    });
    //f.get('favourite').setValue(true);
    this.favorite = !this.favorite;
    console.log(this.favorite);
    */
    this.favourite = !this.favourite;
    console.log(this.favourite);
    f.get('favourite').patchValue(this.favourite);

    //console.log(this.addRecipeForm.valueChanges);
  }
}
