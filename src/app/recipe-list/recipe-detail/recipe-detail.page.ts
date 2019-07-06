import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeListPage } from '../recipe-list.page';
import { Location } from '@angular/common';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  recipeName : string = '';
  imageLink: string;
  name: string;
  description: string;
  ingredients: string[];
  timeNeeded: number;
  favourite: boolean;

  constructor(private _route : ActivatedRoute,
              private _location : Location,
              private _recipeListComponent : RecipeListPage
    ) { 
    this.getRecipeNameFromURL();
  }

  ngOnInit() {
  }

  getRecipeNameFromURL() {
    console.log("Params: " + this._route.snapshot.paramMap.get('id'));
    this._recipeListComponent.listOfRecipes.forEach((res) => {
      if (res.id.toString() == this._route.snapshot.paramMap.get('id')) {
        this.recipeName = res.name;
        console.log("Recipe Name: " + res.name);
        this.getCurrentRecipe();
      }
    });
  }

  onBack() {
    this._location.back();
  }

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

  onFavourite() {
    this._recipeListComponent.listOfRecipes.forEach((recipe) => {
      if (recipe.id.toString() == this._route.snapshot.paramMap.get('id')) {
        recipe.favourite = !recipe.favourite;
        this.getCurrentRecipe();
        console.log("Recipe favourited: " + recipe.favourite);
      }
    }
  )};
}
