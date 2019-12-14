import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { Recipe } from '../recipe';
import { ImageService } from 'src/app/image.service';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {
  // Get the latest ID to use
  @Input() id: number;

  // Get other information for calculations and to fill up the form
  @Input() recipe: Recipe;
  @Input() name: string = "";
  @Input() imageLink: string = "";
  @Input() description: string = "";
  @Input() ingredients;
  @Input() timeNeeded: number = 0;
  @Input() favourite: boolean = false;

  // The form to use
  addRecipeForm : FormGroup;

  imageUploaded = "No Image";

  constructor(
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
    private _angularFireStore: AngularFirestore,
    private _imageService: ImageService
  ) {
    // Initialized the form
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
    // Check whether the form needs to be prefilled using the recipe name
    if (this.name == null || this.name == "") {
      // If there is no name passed to the modal, assume that it was triggered from add recipe button and prefill stuffs
      console.log("Name is null. Setting it to empty.");
      this.name = "";
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
    this.addRecipeForm.patchValue({
      'recipeName': this.name,
      'imageLink': this.imageLink,
      'description': this.description,
      'timeNeeded': this.timeNeeded,
      'favourite': this.favourite,
    });
    this.prefillIngredients();
  }

  prefillIngredients() {
    //console.log(this.ingredients[0].ingredients);

    // Create the number of controls with name ingredients first based on the number of objects in ingredients array
    if (this.ingredients != null && this.ingredients.length > 1) {
      for (let index = 0; index < this.ingredients.length - 1; index++) {
        this.addIngredients();
        console.log('Added ingredients field for every ingredient.');
      }

      // For every control, loop through this.ingredients and patch its values
      let index = 0;
      this.getIngredients().controls.forEach(control => {
        control.get('ingredients').setValue(this.ingredients[index].ingredients);
        index += 1;
      });
    } else if (this.ingredients != null) {
      // Just fill in the one ingredient
      this.getIngredients().controls[0].get('ingredients').setValue(this.ingredients[0].ingredients);
      console.log(this.getIngredients().controls[0].get('ingredients').value);
    }
  }

  getIngredients() {
    // Get the ingredients in the form as a FormArray
    return this.addRecipeForm.get('ingredientsArray') as FormArray;
  }

  addIngredientsGroup() {
    // Add a group into the form array with ingredients as the object
    return this._formBuilder.group({
      ingredients: [''],
    });
  }

  addIngredients() {
    this.getIngredients().push(this.addIngredientsGroup());
    console.log("Added ingredients group to the Form Array.");
  }

  onDeleteIngredients(position) {
    // Delete the ingredients object at position x in the FormArray
    console.log("Deleted " + this.getIngredients().at(position).get('ingredients').value);
    this.getIngredients().removeAt(position);
  }

  onSubmitRecipe(f: FormGroup) {
    console.log('ID in modal before submitting is: ' + this.id);
    console.log(f.get('ingredientsArray').value);
    let data = {
      "id": this.id,
      "imageLink": f.get('imageLink').value,
      "name": f.get('recipeName').value,
      "description": f.get('description').value,
      "ingredients" : f.get('ingredientsArray').value,
      "timeNeeded": f.get('timeNeeded').value,
      "favourite": f.get('favourite').value,
    }
    console.log("Data: ");
    console.log(data);
    // Dismiss the modal while sending data as the data
    this._modalController.dismiss(data);
    //console.log(f);
  }

  onDismiss() {
    // Dismiss without sending data
    this._modalController.dismiss();
    console.log("Dismissed modal without data");
  }

  onDebugForm(f: FormGroup) {
    this.favourite = !this.favourite;
    console.log(this.favourite);
    f.get('favourite').patchValue(this.favourite);
  }

  getControls() {
    return (this.addRecipeForm.get('ingredientsArray') as FormArray).controls;
  }

  getNewImageLink(event) {
    console.log("Outputting new link from child to parent");
    console.log(event);
    this.addRecipeForm.get('imageLink').setValue(event);
  }

  async onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event.target.files[0].name);
    console.log(this._imageService);
    this.imageUploaded = "Uploading Image...";
    this.imageUploaded = await this._imageService.uploadImageAndReturnURL(event.target.files[0]);
    console.log(this.imageUploaded);
  }
}
