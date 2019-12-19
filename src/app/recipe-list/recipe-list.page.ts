import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { Router } from '@angular/router';
import { RecipeServiceService } from '../recipe-service.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.page.html',
  styleUrls: ['./recipe-list.page.scss'],
})
export class RecipeListPage implements OnInit {
  recipe;

  constructor(
      private _router: Router,
      private _recipeService: RecipeServiceService,
    ) { 
    }

  ngOnInit() {
    this.initRecipe();
  }

  initRecipe() {
    // Load data from the database and update it when there are any changes in realtime
    this._recipeService.getRecipeWithUpdates().subscribe(results => {
      this._recipeService.recipeArray = results;
    });
  }

  cardFavourite(recipe: Recipe) {
    this._recipeService.toggleCardFavourite(recipe);
  }

  onClickRecipe(recipe: Recipe) {
    console.log("Clicked name: " + recipe.name);
    this._router.navigate(['recipe-list', recipe.id]);
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  addDefaultRecipes() {
    this._recipeService.addDefaultRecipes();
  }

  trackRecipe(index, item) {
  }
}
