import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeServiceService } from 'src/app/recipe-service.service';
import { Subscription } from 'rxjs';
import * as Quill from 'quill';
import { Delta } from 'quill';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  id: number;
  recipe;
  imageLink: string;
  name: string;
  description;
  ingredients;
  timeNeeded: number;
  favourite: boolean;
  recipeSubscription: Subscription;

  // Quill text viewer
  quill: Quill;

  constructor(
    private _route : ActivatedRoute,
    private _recipeService : RecipeServiceService,
    ) { 
  }

  ngOnInit() {
    // Initialize Variables
    this.setupQuill();
    this.getRecipeNameFromURL();
  }

  setupQuill() {
    this.quill = new Quill('#quill-viewer', {
      modules: {
        toolbar: false,
      },
      readOnly: true,
      theme: 'snow',
    });
  }

  setQuillViewer(delta: Delta) {
    this.quill.setContents(delta, 'api');
    console.log("Setting quill editor's content to:");
    console.log(this.quill.getContents());
  }

  getQuillViewerTextLength(): boolean {
    //console.log(this.quill.getLength());
    if (this.quill.getLength() > 1) {
      return false;
    } else {
      return true;
    }
  }

  getRecipeNameFromURL() {
    // Sets the data for the recipe
    console.log("Params ID in the URL: " + parseInt(this._route.snapshot.paramMap.get('id')));
    this.recipeSubscription = this._recipeService.getRecipeWithUpdates("id", parseInt(this._route.snapshot.paramMap.get('id'))).subscribe(recipe => {
      console.log("getRecipeNameFromURL's ID:");
      console.log(recipe);
      this.recipe = recipe[0].payload.doc;
      this.id = this.recipe.get('id');
      console.log("ID: " + this.id);
      this.name = this.recipe.get('name');
      this.imageLink = this.recipe.get('imageLink');
      console.log(this.recipe.get('description'));
      this.description = this._recipeService.convertStringToDelta(this.recipe.get('description'));
      console.log("Ingredients: " + this.recipe.get('ingredients'));
      // Add ingredientsArray to ingredients
      this.ingredients = this.recipe.get('ingredients');
      this.timeNeeded = this.recipe.get('timeNeeded');
      this.favourite = this.recipe.get('favourite');

      // Set quill viewer to show description
      console.log(this.description);
      console.log("Setting quill viewer");
      this.setQuillViewer(this.description);
    });
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onEditRecipe() {
    this._recipeService.onEditRecipe(this.recipe).then(() => {
      console.log("Editing recipe completed!");
    });
  }

  onDeleteRecipe() {
    // Unsubscribe so as not to cause payload error
    this.recipeSubscription.unsubscribe();
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onFavourite() {
    console.log("Document in detail's bool: " + this.recipe.get('favourite'));
    console.log(this.recipe);
    this._recipeService.toggleCardFavourite(this.recipe);
  };

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.recipeSubscription.unsubscribe();
  }
}
