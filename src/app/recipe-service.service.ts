import { Injectable, NgZone } from '@angular/core';
import { Recipe } from './recipe-list/recipe';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {
  private listOfRecipes: Recipe[] = [
    {
      id: 1,
      imageLink: 'https://www.jocooks.com/wp-content/uploads/2013/10/classic-apple-pie-1-2-500x500.jpg',
      name: 'Apple Pie',
      ingredients: [' Apple', ' Pie'],
    },
    {
      id: 2,
      imageLink: 'https://www.ohhowcivilized.com/wp-content/uploads/2019/05/0519-bubble-tea-16-2.jpg',
      name: 'Milk Tea',
      description: 'Vivamus faucibus tincidunt eros sed scelerisque. Pellentesque bibendum urna at neque vehicula, in vulputate dolor porttitor. Duis finibus lectus vitae libero blandit, vel commodo magna tincidunt. Maecenas odio orci, luctus ac consectetur at, imperdiet at orci. Nunc efficitur odio elit. Nulla accumsan, enim at suscipit euismod, lectus justo viverra odio, a pulvinar felis elit quis eros. Donec tincidunt sed libero non iaculis.',
      ingredients: [' Milk', ' Tea'],
      timeNeeded: 70,
      favourite: true,
    }
  ];

  constructor(private _router: Router,
    private _alertController: AlertController,
    private _ngZone: NgZone) {

  }

  getAllRecipes() {
    return this.listOfRecipes;
  }

  getRecipeById(id: number) {
    /*
    this.listOfRecipes.forEach((recipe) => {
      if (recipe.id == id) {
        console.log("Recipe Name: " + recipe.name);
        return recipe;
      };
    });
    */

    return this.listOfRecipes.find((recipe) => {
      console.log("Recipe Name getRecipeById: " + recipe.name);
      return recipe.id == id;
    });
  }

  toggleFavourite(recipe: Recipe) {
    recipe.favourite = !recipe.favourite;
    console.log(recipe.favourite);
  }

  onAddRecipe() {
    console.log("Added Recipe");
  }

  onDeleteRecipe(recipe: Recipe) {
    // Show Confirmation and do stuffs
    this.deleteAlert(recipe);
    // Delete Recipe by ID
    // console.log("Deleted " + recipe.id + ", " + recipe.name);
  }

  async deleteAlert(recipe: Recipe) {
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
          console.log(recipeToDelete.name);
          if (recipeToDelete) {
            this.listOfRecipes.splice(recipeToDelete.id - 1, 1);
            console.log("Deleted Recipe");
          }
          this._ngZone.run( async () => {
            await this._router.navigate(['/recipe-list']);
          })
          alert.dismiss();
        }
      }]
    });

    alert.present();

  }
}
