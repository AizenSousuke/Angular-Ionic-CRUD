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
  recipe : Recipe;
  imageLink: string;
  name: string;
  description: string;
  ingredients: string[];
  timeNeeded: number;
  favourite: boolean;

  constructor(private _route : ActivatedRoute,
              private _router : Router,
              private _location : Location,
              private _recipeListComponent : RecipeListPage,
              private _recipeService : RecipeServiceService,
    ) { 
    this.getRecipeNameFromURL();
  }

  ngOnInit() {
  }

  getRecipeNameFromURL() {
    console.log("Params: " + this._route.snapshot.paramMap.get('id'));

    this.recipe = this._recipeService.getRecipeById(parseInt(this._route.snapshot.paramMap.get('id')));
    this.name = this.recipe.name;
    this.imageLink = this.recipe.imageLink;
    this.description = this.recipe.description;
    this.ingredients = this.recipe.ingredients;
    this.timeNeeded = this.recipe.timeNeeded;
    this.favourite = this.recipe.favourite;
    console.log("Current Recipe: " + this.recipe.name);
    /*
    this._recipeListComponent.listOfRecipes.forEach((res) => {
      if (res.id.toString() == this._route.snapshot.paramMap.get('id')) {
        this.recipeName = res.name;
        console.log("Recipe Name: " + res.name);
        this.getCurrentRecipe();
      }
    });
    */
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onDeleteRecipe() {
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onBack() {
    //this._location.back();
    this._router.navigate(['/recipe-list']);
  }

  /*
  getCurrentRecipe() {
    this._recipeListComponent.listOfRecipes.forEach((recipe) => {
      if (recipe.name == this.recipeName) {
        this.name = recipe.name;
        this.imageLink = recipe.imageLink;
        this.description = recipe.description;
        this.ingredients = recipe.ingredients;
        this.timeNeeded = recipe.timeNeeded;
        this.favourite = recipe.favourite;
        console.log("Current Recipe: " + recipe.name);
      }
    });
  }
  */

  onFavourite() {
    this._recipeListComponent.listOfRecipes.forEach((recipe) => {
      if (recipe.id.toString() == this._route.snapshot.paramMap.get('id')) {
        recipe.favourite = !recipe.favourite;
        this.getRecipeNameFromURL();
        console.log("Recipe favourited: " + recipe.favourite);
      }
    }
  )};
}
