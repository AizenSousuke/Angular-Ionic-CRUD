import { Injectable, NgZone, Component } from '@angular/core';
import { Recipe } from './recipe-list/recipe';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RecipeModalPage } from './recipe-list/recipe-modal/recipe-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {
  // List of recipes
  /*
  private listOfRecipes: Recipe[] = [
    {
      id: 1,
      imageLink: 'https://www.jocooks.com/wp-content/uploads/2013/10/classic-apple-pie-1-2-500x500.jpg',
      name: 'Apple Pie',
      ingredients: ['Apple', 'Pie'],
    },
    {
      id: 2,
      imageLink: 'https://www.ohhowcivilized.com/wp-content/uploads/2019/05/0519-bubble-tea-16-2.jpg',
      name: 'Milk Tea',
      description: 'Vivamus faucibus tincidunt eros sed scelerisque. Pellentesque bibendum urna at neque vehicula, in vulputate dolor porttitor. Duis finibus lectus vitae libero blandit, vel commodo magna tincidunt. Maecenas odio orci, luctus ac consectetur at, imperdiet at orci. Nunc efficitur odio elit. Nulla accumsan, enim at suscipit euismod, lectus justo viverra odio, a pulvinar felis elit quis eros. Donec tincidunt sed libero non iaculis.',
      ingredients: ['Milk', 'Tea'],
      timeNeeded: 70,
      favourite: true,
    },
    {
      id: 3,
      imageLink: 'https://s3media.freemalaysiatoday.com/wp-content/uploads/2017/06/kuih-raya.jpg',
      name: 'Kuih Raya',
      description: 'Mimas vulputate dolor porttitor. Duis finibus lectus vitae libero blandit, vel commodo magna tincidunt. Maecenas odio orci, luctus ac consectetur at, imperdiet at orci. Nunc efficitur odio elit. Nulla accumsan, enim at suscipit euismod, lectus justo viverra odio, a pulvinar felis elit quis eros. Donec tincidunt sed libero non iaculis.',
      ingredients: ['Kuih', 'Raya'],
      timeNeeded: 120,
      favourite: false,
    }
  ];
  */

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

  getAllRecipesCollection() {
    return this._fireStore.collection('recipe-list');
  }

  getAllRecipesSnapshots() {
    return this._fireStore.collection('recipe-list').snapshotChanges();
  }

  getRecipeByName(document) {
    console.log('Getting recipe with name: ' + document);
    return this._fireStore.collection('recipe-list').doc(document.toString()).get();
  }

  setDocFavourite(document, prev) {
    let fav;
    /*
    this._fireStore.collection('recipe-list').doc(document.toString()).get().subscribe(favourite => {
      console.log('Current Favourite: ' + favourite.get('favourite'));
      fav = !favourite.get('favourite');
      console.log('Favourite will be set to: ' + fav);
      this._fireStore.collection('recipe-list').doc(document.toString()).set({ 'favourite' : fav }, { 'merge' : true });
    });
    */
    console.log('Current Favourite: ' + prev);
    fav = !prev;
    console.log('Favourite will be set to: ' + fav);
    this._fireStore.collection('recipe-list').doc(document.toString()).set({ 'favourite' : fav }, { 'merge' : true });
  }

  toggleFavourite(recipe) {
    // Toggles favourite
    recipe.favourite = !recipe.favourite;
    // Write to database
    console.log('Recipe ID: ' + recipe.id.toString());
    console.log('Recipe Name: ' + recipe.name.toString());
    this._fireStore.collection('recipe-list').doc(recipe.name.toString()).set({ 'favourite' : recipe.favourite }, { 'merge' : true });
    console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
  }

  countRecipeInDatabase() {
    // Set the recipe ID first
    this.getAllRecipesCollection().ref.get().then(recipe => {
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
        "imageLink": recipe.get('imageLink') ? recipe.get('imageLink') : "",
        "description": recipe.get('description') ? recipe.get('description') : "",
        "ingredients": recipe.get('ingredients') ? recipe.get('ingredients') : "",  // TODO: Temp .toString()
        "timeNeeded": recipe.get('timeNeeded') ? recipe.get('timeNeeded') : "",
        "favourite": recipe.get('favourite') ? true : false,
      }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    // TODO: This function runs when modal is dismissed without data. It shouldn't run. Fixed with != undefined check. 
    if (data != undefined) {
      console.log("Data on modal dismissed");
      console.log(data);
      // Update data in the database here
      // TODO: Error here in data.data.name
      this._fireStore.collection('recipe-list').doc(data.name.toString()).set(data, { 'merge' : true });

      // Show the toast
      const toast = await this._toastController.create({
        message: 'Recipe updated successfully!',
        duration: 2000,
        showCloseButton: true, 
      });
      toast.present();
      console.log("Shown toast");

      // TODO: Update the recipe detail page here
    }
  }

  addDefaultRecipes() {
    let data = [
      {
        "id": 1,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '1',
        "ingredients": ['1'],
      },
      {
        "id": 2,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '2',
        "ingredients": ['2'],
      },
      {
        "id": 3,
        "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
        "name": '3',
        "ingredients": ['3'],
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
      this._fireStore.collection('recipe-list').doc((i+1).toString()).set(data[i] , { 'merge' : true });
    }
  }
}