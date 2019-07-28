import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeListPage } from '../recipe-list.page';
import { Location } from '@angular/common';
import { RecipeServiceService } from 'src/app/recipe-service.service';
import { Recipe } from '../recipe';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  id: number;
  //recipe : Recipe;
  recipe;
  imageLink: string;
  name: string;
  description: string;
  ingredients: string[];
  timeNeeded: number;
  favourite: boolean;

  recipeInDatabase: Array<any>;

  constructor(
    private _route : ActivatedRoute,
    private _recipeListComponent : RecipeListPage,
    private _recipeService : RecipeServiceService,
    ) { 
    this.getRecipeNameFromURL();
  }

  ngOnInit() {
    
  }

  getRecipeNameFromURL() {
    // Sets the data for the recipe
    console.log("Params ID: " + this._route.snapshot.paramMap.get('id'));
    this.recipe = this._recipeService.getRecipeById(parseInt(this._route.snapshot.paramMap.get('id')));
    console.log("Recipe: " + this.recipe);
    this.id = this.recipe.id;
    this.name = this.recipe.name;
    this.imageLink = this.recipe.imageLink;
    this.description = this.recipe.description;
    this.ingredients = this.recipe.ingredients;
    this.timeNeeded = this.recipe.timeNeeded;
    this.favourite = this.recipe.favourite;
    console.log("Current Recipe: " + this.recipe.name);
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onDeleteRecipe() {
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onFavourite() {
    console.log(this._recipeListComponent.listOfRecipes);
    this.recipe = this._recipeService.getRecipeById(parseInt(this._route.snapshot.paramMap.get('id')));
    // Use the function in the parent component
    this._recipeListComponent.cardFavourite(this.recipe);
    // Get the recipe again by refreshing the data so that favourite bool is updated
    this.getRecipeNameFromURL();
  };
}
