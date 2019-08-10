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
    console.log("Params ID in the URL: " + this._route.snapshot.paramMap.get('id'));
    this._recipeService.getRecipeByName(this._route.snapshot.paramMap.get('id').toString()).subscribe(data => {
      this.recipe = data;
      this.id = this.recipe.get('id');
      console.log("ID: " + this.id);
      this.name = this.recipe.get('name');
      this.imageLink = this.recipe.get('imageLink');
      this.description = this.recipe.get('description');
      console.log("Ingredients: " + this.recipe.get('ingredients'));
      //console.log(this.recipe.get('ingredients')[0].ingredients);
      //console.log("Ingredients Length: " + this.recipe.get('ingredients').length);
      // For each ingredient, add it to the ingredient string[]
      this.ingredients = this.recipe.get('ingredients');
      /*
      for (let ingredient = 0; ingredient < this.recipe.get('ingredients').length; ingredient++) {
        const element = this.recipe.get('ingredients')[ingredient].ingredients;
        console.log(element);
        this.ingredients.push(element.value);
      }
      */
      /*
      if (this.recipe.get('ingredients').length > 1) {
        this.ingredients = this.recipe.get('ingredients'); //.split(',');
      } else {
        this.ingredients = this.recipe.get('ingredients');
      }
      */
      this.timeNeeded = this.recipe.get('timeNeeded');
      this.favourite = this.recipe.get('favourite');
    });
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onEditRecipe() {
    this._recipeService.onEditRecipe(this.recipe);
  }

  onDeleteRecipe() {
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onFavourite() {
    this._recipeService.setDocFavourite(this._route.snapshot.paramMap.get('id').toString(), this.favourite);
    this.favourite = !this.favourite;
    console.log('Updating favourite');
    console.log(this.recipe); // Document Snapshot
    this._recipeService.getRecipeByName(this._route.snapshot.paramMap.get('id').toString()).subscribe(data => {
      this.recipe = data;
    }); // TODO: This returns an Observable which caused errors when trying to edit the recipe after running this function.
    console.log(this.recipe); // Observable
  };
}
