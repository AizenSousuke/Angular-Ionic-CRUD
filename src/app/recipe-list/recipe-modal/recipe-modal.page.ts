import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
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

  /*
  addRecipeForm : FormGroup = this._formBuilder.group({
    recipeName: [''],
    imageLink: [''],
    description: [''],
    ingredients: [''],
    timeNeeded: [''],
    favourite: [''],
  });
  */
  addRecipeForm : FormGroup;/* = this._formBuilder.group({
    recipeName: [''],
    imageLink: [''],
    description: [''],
    ingredientsArray: this._formBuilder.array([
      
    ]),
    timeNeeded: [''],
    favourite: [''],
  });
  */

  constructor(
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
    private _angularFireStore: AngularFirestore,
  ) {
    this.addRecipeForm = this._formBuilder.group({
      recipeName: [''],
      imageLink: [''],
      description: [''],
      ingredientsArray: this._formBuilder.array([
        this.addIngredientsGroup()
      ]),
      timeNeeded: [''],
      favourite: [''],
    });
  }

  ngOnInit() {
    this.setup();
  }

  setup() {
    if (this.name == null || this.name == "") {
      // If there is no name passed to the modal, assume that it was triggered from add recipe button and prefill stuffs
      console.log("Name is null");
      this.addRecipeForm.get('imageLink').setValue('https://cdn.auth0.com/blog/get-started-ionic/logo.png');
      this._angularFireStore.collection('recipe-list').ref.get().then(recipe => {
        this.id = recipe.size + 1;
        console.log('ID in modal set to: ' + this.id);
      });
    } else {
      // Prefill the values
      this.prefillValues(this.recipe);
    }
  }

  prefillValues(recipe: Recipe) {
    console.log("Prefilling values")
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
    //console.log(this.addRecipeForm.get('ingredientsArray'));
    //const ingredientsArray = this.addRecipeForm.get('ingredientsArray') as FormArray;
    //console.log(ingredientsArray.at(0).value);
    this.addRecipeForm.patchValue({
      'recipeName': this.name,
      'imageLink': this.imageLink,
      'description': this.description,
      'timeNeeded': this.timeNeeded,
      'favourite': this.favourite,
    });
    //console.log(this.addRecipeForm.get('ingredients').value);
    this.prefillIngredients();
  }

  prefillIngredients() {
    console.log();
    // Create the number of controls first based on the number of objects in ingredients array
    for (let index = 0; index < this.ingredients.length - 1; index++) {
      this.addIngredients();
      console.log('Added ingredients field for every ingredient.');
    }
    let index = 0;
    this.getIngredients().controls.forEach(control => {
      control.get('ingredients').setValue(this.ingredients[index].toString());
      index += 1;
    });
  }

  getIngredients() {
    return this.addRecipeForm.get('ingredientsArray') as FormArray;
  }

  addIngredientsGroup() {
    return this._formBuilder.group({
      ingredients: [''],
    });
  }

  addIngredients() {
    this.getIngredients().push(this.addIngredientsGroup());
    console.log("Added ingredients");
  }

  onDeleteIngredients(ingredients) {
    console.log("Deleted " + this.getIngredients().at(ingredients).get('ingredients').value);
    this.getIngredients().removeAt(ingredients);
  }

  onSubmitRecipe(f: FormGroup) {
    // Convert string of ingredients to string[] by ','
    console.log('ID in modal before submitting is: ' + this.id);
    console.log("Ingredients: " + f.get('ingredients').value);
    let data = {
      "id": this.id,
      "imageLink": f.get('imageLink').value,
      "name": f.get('recipeName').value,
      "description": f.get('description').value,
      "ingredients": f.get('ingredients').value.split(','), // TODO: Somehow errors out when no value is input by the user when submitting the form
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
