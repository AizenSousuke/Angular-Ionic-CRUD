import { Injectable, NgZone } from '@angular/core';
import { Recipe } from './recipe-list/recipe';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RecipeModalPage } from './recipe-list/recipe-modal/recipe-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

@Injectable()
export class RecipeServiceService {

  // Recipe array for calculations 
  recipe: Array<any>;
  // Recipe Number for calculations
  id: number;

  constructor(
    private _fireStore: AngularFirestore,
    private _router: Router,
    private _alertController: AlertController,
    private _ngZone: NgZone,
    private _modalController: ModalController,
    private _toastController: ToastController,
    ) {

  }

  // Get all the recipes from the collection. This is used to edit\delete.
  getAllRecipesCollection() {
    return this._fireStore.collection('recipe-list');
  }

  // Get all the recipes and metadata from the collection. This is used to put the data in a list\array for realtime changes tracking.
  getAllRecipesSnapshots() {
    return this._fireStore.collection('recipe-list')
                          .snapshotChanges();
  }

  // Get a recipe object by name
  getRecipeByName(recipeName) {
    console.log('Getting recipe with name: ' + recipeName);
    return this._fireStore.collection('recipe-list')
                          .doc(recipeName.toString())
                          .get();
  }

  // Gets the ingredients in the recipe as an array to be used with FormArray later
  getRecipeIngredients(recipe : Recipe) {
    return recipe.ingredients;
  }

  // Set the favourite status of the recipe by inversing it
  setDocFavourite(document, prev) {
    let fav;
    console.log('Current Favourite: ' + prev);
    fav = !prev;
    this._fireStore.collection('recipe-list')
                    .doc(document.toString())
                    .set({ 'favourite' : fav }, { 'merge' : true })
                    .then(() => {
                      console.log('Favourite has be set to: ' + fav);
    });
  }

  // Toggle the favourite status of the recipe by inversing it
  toggleFavourite(recipe) {
    // Toggle favourite
    recipe.favourite = !recipe.favourite;
    // Write to database
    console.log('Recipe ID: ' + recipe.id.toString());
    console.log('Recipe Name: ' + recipe.name.toString());
    this._fireStore.collection('recipe-list')
                    .doc(recipe.name.toString())
                    .set({ 'favourite' : recipe.favourite }, { 'merge' : true })
                    .then(() => {
                      console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
    });
  }

  // Count the number of recipes in the database
  countRecipeInDatabase() {
    // Set the recipe ID first
    this.getAllRecipesCollection()
        .ref
        .get()
        .then(recipe => {
          this.id = recipe.size;
          console.log('ID set to: ' + this.id);
    });
  }

  async onAddRecipe() {
    // Creates a modal that user can input to create a new Recipe
    let modal = await this._modalController.create({
      component: RecipeModalPage,
      componentProps: {
        "id": this.id,
      },
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != undefined) {
      // TODO: Check if recipe name data exists and let user choose if he wants to replace it by recipe name

      // Save data to the database here
      console.log('ID before set: ' + data.id);
      console.log("Data:");
      console.log(data);
      this._fireStore.collection('recipe-list').doc(data.name.toString()).set(data, { 'merge' : false });

      // Go to the recipe list page here
      this._router.navigate(['/recipe-list']);

      // Show the toast
      const toast = await this._toastController.create({
        message: 'Recipe created successfully!',
        duration: 2000,
        showCloseButton: true, 
      });
      toast.present();
      console.log("Shown toast");
    }
    console.log('Data: ' + data);
  }

  async onDeleteRecipe(recipe) {
    // Show Delete Confirmation Alert. If user clicks delete, then it will delete. If not, it will just close the alert. 
    const alert = await this._alertController.create({
      backdropDismiss: false,
      header: 'Delete the Recipe?',
      message: 'Click Delete to Delete the Recipe.',
      buttons: [{
        text: 'Cancel',
        handler: () => {
          console.log("Cancel has been selected");
          alert.dismiss();
        }
      }, {
        text: 'Delete',
        handler: () => {
          console.log("Delete has been selected");          
          //Delete the recipe from the database
          console.log("Deleting: " + recipe.get('name').toString());
          this._fireStore.collection('recipe-list').doc(recipe.get('name').toString()).delete().then(() => {
            console.log('Deleted!');
            // Update all the ids in the collection so as not to rewrite\merge data that's already in the database

            let num = 1;
            this.getAllRecipesCollection().get().subscribe(recipe => {
              recipe.forEach(x => {
                console.log('Found recipe');
                //console.log('Old ID: ' + x.get('id'));
                this._fireStore.collection('recipe-list').doc(x.get('name').toString()).set(
                  { 'id' : num }, { 'merge' : true }
                );
                //console.log('New ID: ' + (x.get('id')+1));
                num += 1;
              });
            });
          });

          // Make navigation run from within Angular. Will result in an error if not using _ngZone
          this._ngZone.run( async () => {
            await this._router.navigate(['/recipe-list']);
          })
          // Dimiss the alert
          alert.dismiss();
        }
      }]
    });

    // Presents the alert
    alert.present();
  }

  async onEditRecipe(recipe : FormControl) {
    console.log(recipe);
    console.log("Editting Recipe: " + recipe.get('name'));
    console.log("Favourite: " + (recipe.get('favourite') ? true : false));
    // Create modal to edit recipe
    let modal = await this._modalController.create({
      component: RecipeModalPage,
      componentProps: {
        "recipe": recipe,
        "id": recipe.get('id'),
        "name": recipe.get('name'),
        "imageLink": recipe.get('imageLink'),
        "description": recipe.get('description') ? recipe.get('description') : "",
        "ingredients": recipe.get('ingredients'),  
        "timeNeeded": recipe.get('timeNeeded') ? recipe.get('timeNeeded') : "",
        "favourite": recipe.get('favourite') ? true : false,
      }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    // This function runs when modal is dismissed without data. It shouldn't run. Fixed with != undefined check. 
    if (data != undefined) {
      console.log("Data on modal dismissed");
      console.log(data);
      // Update data in the database here
      this._fireStore.collection('recipe-list').doc(data.name.toString()).set(data, { 'merge' : true });
      
      // Show the toast
      const toast = await this._toastController.create({
        message: 'Recipe updated successfully!',
        duration: 2000,
        showCloseButton: true, 
      });
      toast.present();
      console.log("Shown toast");
    }
  }

  addDefaultRecipes() {
    let data = [
      {
        "id": 1,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '1',
        "ingredients": [{"ingredients" : "1"}],
      },
      {
        "id": 2,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '2',
        "ingredients": [{"ingredients" : "2"}],
      },
      {
        "id": 3,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '3',
        "ingredients": [{"ingredients" : "3"}],
      }
    ];
    // Delete existing recipes
    /*
    for (let i=0; i<3; i++) {
      this._fireStore.collection('recipe-list').doc((i+1).toString()).delete();
    }
    */
    // Add the 3 recipes
    for (let i=0; i<3; i++) {
      this._fireStore.collection('recipe-list').doc((i+1).toString()).set(data[i] , { 'merge' : false });
    }
  }
}