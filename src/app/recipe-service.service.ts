import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RecipeModalPage } from './recipe-list/recipe-modal/recipe-modal.page';
import { AngularFirestore, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore';
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

  // The collection name in firestore to use for recipe
  recipeCollection : string = 'recipe-list';
  // An array of recipes will be stored in this recipe service. All modules and components are to get their recipe data from here after the refactoring. 
  recipeArray: DocumentChangeAction<any>[];

  // Toast duration in milliseconds
  toastDuration: number = 2000;

  constructor(
    private _fireStore: AngularFirestore,
    private _router: Router,
    private _alertController: AlertController,
    private _ngZone: NgZone,
    private _modalController: ModalController,
    private _toastController: ToastController,
    ) {
  }

  // Refactored functions ==================================================

  // Get a document
  getRecipeDocument(name: string) {
    return this._fireStore.collection(this.recipeCollection);
  }

  // Get x recipe data once. Include a parameter if you want an array of recipe(s) that matches the recipeId. If not, it will return all recipes.
  getRecipeWithoutUpdates(queryString: string = "id", queryParam?: string | number) {
    if (queryParam) {
      return this._fireStore.collection(this.recipeCollection, query => query.where(queryString, "==", queryParam)).get();
    } else {
      return this._fireStore.collection(this.recipeCollection).get();
    }
  }

  // Get a recipe by id and listen to updates from firestore
  getRecipeWithUpdates(queryString: string = "id", queryParam?: string | number) {
    if (queryParam) {
      return this._fireStore.collection(this.recipeCollection, query => query.where(queryString, "==", queryParam)).snapshotChanges();
    } else {
      return this._fireStore.collection(this.recipeCollection).snapshotChanges();
    }
  }
  
  // Count the number of recipes in the database
  countRecipeInDatabase(): number {
    this.getRecipeWithoutUpdates().subscribe(result => {
      console.log("Recipe Count:" + result.size);
      return result.size;
    }).unsubscribe();
    return null;
  }

  // Toggle the favourite status of the recipe by inversing it
  toggleCardFavourite(recipe: QueryDocumentSnapshot<any>) {
    let favourite : boolean = !recipe.get("favourite");
    this.getRecipeWithoutUpdates("name",recipe.get("name")).subscribe(value => {
      console.log("Query's Recipe Name: " + value.docs[0].get("name"));
      console.log("Query's ID: " + value.docs[0].get("id").toString());
      console.log("Value.docs[0] aka document ID: " + value.docs[0].id);
      console.log(value);
      // Write to database
      this._fireStore.collection(this.recipeCollection)
                    .doc(value.docs[0].id)
                    .set({ 'favourite' : favourite }, { 'merge' : true })
                    .then(() => {
                      console.log(recipe.get("name") + "'s Favourite Bool: " + recipe.get("favourite"));
                    }).catch(error => {
                      console.log("Error in toggling favourite: " + error);
                    });
    });
  }

  // Refactored functions End ============================================

  // Get a recipe object by name
  getRecipeByName(recipeName: String) {
    console.log('Getting recipe with name: ' + recipeName);
    return this._fireStore.collection(this.recipeCollection)
                          .doc(recipeName.toString())
                          .get();
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
        duration: this.toastDuration,
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
            this.getRecipeWithoutUpdates().subscribe(recipe => {
              recipe.forEach(x => {
                console.log('Found recipe');
                //console.log('Old ID: ' + x.get('id'));
                this._fireStore.collection(this.recipeCollection).doc(x.get('name').toString()).set(
                  { 'id' : num }, { 'merge' : true }
                );
                //console.log('New ID: ' + (x.get('id')+1));
                num += 1;
              });
            }).unsubscribe();
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
        duration: this.toastDuration,
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