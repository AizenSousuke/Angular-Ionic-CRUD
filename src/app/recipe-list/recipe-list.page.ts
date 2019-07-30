import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { Router } from '@angular/router';
import { RecipeServiceService } from '../recipe-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.page.html',
  styleUrls: ['./recipe-list.page.scss'],
})
export class RecipeListPage implements OnInit {
  recipe: Array<any>;

  constructor(
      private _router: Router,
      private _recipeService: RecipeServiceService,      
    ) { 
    }

  ngOnInit() {
    // Load data from the database
    this._recipeService.getAllRecipesSnapshots().subscribe(result => {
      this.recipe = result;
      this._recipeService.recipe = result;
    });
  }

  cardFavourite(recipe) {
    // Toggle favourite using the _recipeService
    this._recipeService.toggleFavourite(recipe);
  }

  onClickRecipe(recipe : Recipe) {
    console.log("Clicked: " + recipe.name + " | id: " + recipe.id);
    this._router.navigate(['recipe-list', recipe.id]);
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  addDefaultRecipes() {
    this._recipeService.addDefaultRecipes();
  }
}
