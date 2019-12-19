import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RecipeModalPage } from './recipe-list/recipe-modal/recipe-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Recipe } from './recipe-list/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {

  // Recipe array for calculations 
  recipe: Array<any>;
  // Recipe Number for calculations
  id: number;
  // Image link default that is placed in the form values if there is nothing
  imageLink = 'https://cdn.auth0.com/blog/get-started-ionic/logo.png';

  // The collection to use for recipe
  recipeCollection = 'recipe-list';

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
  getAllRecipesFromCollection() {
    return this._fireStore.collection(this.recipeCollection);
  }

  // Get all the recipes and metadata from the collection. This is used to put the data in a list\array for realtime changes tracking.
  getAllRecipesFromCollectionSnapshots() {
    return this._fireStore.collection(this.recipeCollection)
                          .snapshotChanges();
  }

  // Get a recipe object by name
  getRecipeByName(recipeName: String) {
    console.log('Getting recipe with name: ' + recipeName);
    return this._fireStore.collection(this.recipeCollection)
                          .doc(recipeName.toString())
                          .get();
  }

  // Set the favourite status of the recipe by inversing the old value
  setDocFavourite(recipe, previousValue) {
    let favouriteStatus;
    console.log('Current Favourite: ' + previousValue);
    favouriteStatus = !previousValue;
    this._fireStore.collection(this.recipeCollection)
                    .doc(recipe.toString())
                    .set({ 'favourite' : favouriteStatus }, { 'merge' : true })
                    .then(() => {
                      console.log('Favourite has be set to: ' + favouriteStatus);
    });
  }

  // Use the query function to return a list of documents that has the following parameters
  async queryDocuments(query: string, value: any) {
    await this._fireStore.collection(this.recipeCollection, query => query.where("name", "==", value))
                    .get()
                    .subscribe(result => {
                      console.log(result);
                      return result.docs;
                    });
  }
  
  // Toggle the favourite status of the recipe by inversing it
  toggleCardFavourite(recipe: Recipe) {
    // Toggle favourite
    recipe.favourite = !recipe.favourite;
    // Write to database
    console.log('Recipe ID: ' + recipe.id.toString());
    console.log('Recipe Name: ' + recipe.name.toString());
    this._fireStore.collection(this.recipeCollection)
                  .doc(this.queryDocuments("name", recipe.name)[0].id)
                  .set({ 'favourite' : recipe.favourite }, { 'merge' : true })
                  .then(() => {
                    console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
    });
  }

  // Toggle the favourite status of the recipe by inversing it
  toggleFavourite(recipe) {
    // !FIXME: BUGGY function. Will create extra card if the document name isn't the same (recipe has been added before)
    // Toggle favourite
    recipe.favourite = !recipe.favourite;
    // Write to database
    console.log('Recipe ID: ' + recipe.id.toString());
    console.log('Recipe Name: ' + recipe.name.toString());
    this._fireStore.collection(this.recipeCollection)
                    .doc(recipe.name.toString())
                    .set({ 'favourite' : recipe.favourite }, { 'merge' : true })
                    .then(() => {
                      console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
    });
  }

  // Count the number of recipes in the database
  countRecipeInDatabase() {
    // Set the recipe ID first
    this.getAllRecipesFromCollection()
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
        "imageLink": this.imageLink,
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
      this._fireStore.collection(this.recipeCollection).doc(data.name.toString()).set(data, { 'merge' : false });

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
          this._fireStore.collection(this.recipeCollection).doc(recipe.get('name').toString()).delete().then(() => {
            console.log('Deleted!');
            // Update all the ids in the collection so as not to rewrite\merge data that's already in the database

            let num = 1;
            this.getAllRecipesFromCollection().get().subscribe(recipe => {
              recipe.forEach(x => {
                console.log('Found recipe');
                //console.log('Old ID: ' + x.get('id'));
                this._fireStore.collection(this.recipeCollection).doc(x.get('name').toString()).set(
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
      console.log(data.id);
      // Update data in the database here
      // !FIXME: If name changes, it will duplicate the recipe in the database. Need to check which recipe has the same id then push the data in to it.
      //this._fireStore.collection(this.recipeCollection).doc(data.name.toString()).set(data, { 'merge' : true });

      //This will return the document that has the query in it
      this._fireStore.collection(this.recipeCollection, query => query.where("id", "==", data.id)).get().subscribe(results => {
        console.log(results);
        // Update if there is any query found
        if (results) {
          this._fireStore.collection(this.recipeCollection).doc(results.docs[0].ref.id.toString()).set(data, { 'merge' : true });
        } else {
          this._fireStore.collection(this.recipeCollection).doc(data.name.toString()).set(data, { 'merge' : true });
        }
      });
      
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
      this._fireStore.collection(this.recipeCollection).doc((i+1).toString()).delete();
    }
    */
    // Add the 3 recipes
    for (let i=0; i<3; i++) {
      this._fireStore.collection(this.recipeCollection).doc((i+1).toString()).set(data[i] , { 'merge' : false });
    }
  }
}