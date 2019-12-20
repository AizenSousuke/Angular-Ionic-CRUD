import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeServiceService } from 'src/app/recipe-service.service';


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
  description: string;
  ingredients;
  timeNeeded: number;
  favourite: boolean;

  constructor(
    private _route : ActivatedRoute,
    private _recipeService : RecipeServiceService,
    ) { 
  }

  ngOnInit() {
    // Initialize Variables
    this.getRecipeNameFromURL();
  }

  getRecipeNameFromURL() {
    // Sets the data for the recipe
    console.log("Params ID in the URL: " + parseInt(this._route.snapshot.paramMap.get('id')));
    this._recipeService.getRecipeWithUpdates("id", parseInt(this._route.snapshot.paramMap.get('id'))).subscribe(recipe => {
      console.log("getRecipeNameFromURL's ID:");
      // !FIXME: Doesn't update with the correct data
      console.log(recipe);
      this.recipe = recipe[0].payload.doc;
      console.log(this.recipe.get('description'));
      this.id = this.recipe.get('id');
      console.log("ID: " + this.id);
      this.name = this.recipe.get('name');
      this.imageLink = this.recipe.get('imageLink');
      this.description = this.recipe.get('description');
      console.log("Ingredients: " + this.recipe.get('ingredients'));
      // Add ingredientsArray to ingredients
      this.ingredients = this.recipe.get('ingredients');
      this.timeNeeded = this.recipe.get('timeNeeded');
      this.favourite = this.recipe.get('favourite');
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
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onFavourite() {
    console.log("Document in detail's bool: " + this.recipe.get('favourite'));
    console.log(this.recipe);
    this._recipeService.toggleCardFavourite(this.recipe);
  };
}
