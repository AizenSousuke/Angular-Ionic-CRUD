import { Injectable, NgZone, Component } from '@angular/core';
import { Recipe } from './recipe-list/recipe';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RecipeModalPage } from './recipe-list/recipe-modal/recipe-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {
  // List of recipes
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

  constructor(
    private _fireStore: AngularFirestore,
    private _router: Router,
    private _alertController: AlertController,
    private _ngZone: NgZone,
    private _modalController: ModalController,
    private _toastController: ToastController) {

  }

  getAllRecipes() {
    return this.listOfRecipes;
  }

  getAllRecipesFromDatabase() {
    return this._fireStore.collection("recipe-list").snapshotChanges();
  }

  getRecipeById(id: number) {
    // Return Recipe Object by id number
    return this.listOfRecipes.find((recipe) => {
      console.log("Recipe Name getRecipeById: " + recipe.name);
      return recipe.id == id;
    });
  }

  toggleFavourite(recipe: Recipe) {
    // Toggles favourite
    recipe.favourite = !recipe.favourite;
    console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
  }

  async onAddRecipe() {
    // Creates a modal that user can input to create a new Recipe
    let modal = await this._modalController.create({
      component: RecipeModalPage
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const toast = await this._toastController.create({
        message: 'Recipe created successfully!',
        duration: 1000,
        showCloseButton: true, 
      });
      toast.present();
      console.log("Shown toast");
    }
    console.log(data);
  }

  onAddRecipeToDatabase() {
    //this._fireStore.collection('recipe-list').add({
    //  name: '',
    //});
  }

  async onDeleteRecipe(recipe: Recipe) {
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
          let recipeToDelete;
          recipeToDelete = this.listOfRecipes.find((res) => {
            if (recipe.id == res.id) {
              console.log("Found: " + recipe.id);
              return true;
            }
          });
          console.log("Deleting Recipe: " + recipeToDelete.name);
          if (recipeToDelete) {
            this.listOfRecipes.splice(recipeToDelete.id - 1, 1);
            // Fix\Bring forward the remaining recipe IDs accordingly in the listOfRecipes
            let id = 0;
            this.listOfRecipes.forEach((recipe) => {
              console.log("Changed recipe id to " + id);
              recipe.id = id;
              id += 1;
            });
            console.log("Deleted Recipe");
            // Delete Recipe by ID
            console.log("Deleted " + recipe.id + ", " + recipe.name);
          }
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
}