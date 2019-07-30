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

  recipe: Array<any>;
  recipeObj;
  id;

  constructor(
    private _fireStore: AngularFirestore,
    private _router: Router,
    private _alertController: AlertController,
    private _ngZone: NgZone,
    private _modalController: ModalController,
    private _toastController: ToastController) {

  }


  getAllRecipes() {
    return this._fireStore.collection('recipe-list');
  }

  getAllRecipesFromDatabase() {
    return this._fireStore.collection('recipe-list').snapshotChanges();
  }

  getRecipeById(id: number) {
    return this._fireStore.collection('recipe-list').doc(id.toString()).get();
  }

  setDocFavourite(id) {
    let fav;
    this._fireStore.collection('recipe-list').doc(id.toString()).get().subscribe(favourite => {
      console.log('Current Favourite: ' + favourite.get('favourite'));
      fav = !favourite.get('favourite');
      console.log('Favourite will be set to: ' + fav);
      this._fireStore.collection('recipe-list').doc(id.toString()).set({ 'favourite' : fav }, { 'merge' : true });
    });
  }

  toggleFavourite(recipe) {
    // Toggles favourite
    recipe.favourite = !recipe.favourite;
    // Write to database
    console.log('Recipe ID: ' + recipe.id.toString());
    this._fireStore.collection('recipe-list').doc(parseInt(recipe.id).toString()).set({ 'favourite' : recipe.favourite }, { 'merge' : true });
    console.log(recipe.name + "'s Favourite Bool: " + recipe.favourite);
  }

  countRecipeInDatabase() {
    // Set the recipe ID first
    this.getAllRecipes().ref.get().then(recipe => {
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
    if (data) {
      // Save data to the database here
      this._fireStore.collection('recipe-list').doc(data.id.toString()).set(data, { 'merge' : false });

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
          console.log("Deleting: " + recipe.get('id').toString());
          this._fireStore.collection('recipe-list').doc(recipe.get('id').toString()).delete().then(() => {
            console.log('Deleted!');
            // Update all the ids in the collection so as not to rewrite\merge data that's already in the database
            let num = 1;
            this.getAllRecipes().get().subscribe(recipe => {
              recipe.forEach(x => {
                console.log('Found recipe');
                console.log('Old ID: ' + x.get('id'));
                this._fireStore.collection('recipe-list').doc(x.get('id').toString()).set(
                  { 'id' : num }, { 'merge' : true }
                );
                console.log('New ID: ' + x.get('id'));
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
    for (let i=0; i<3; i++) {
      this._fireStore.collection('recipe-list').doc((i+1).toString()).set(data[i] , { 'merge' : true });
    }
  }
}