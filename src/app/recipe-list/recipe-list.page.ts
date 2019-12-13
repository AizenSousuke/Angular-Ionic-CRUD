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
  //recipe: Array<any>;
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
    // Load data from the database
    this._recipeService.getAllRecipesSnapshots().subscribe(result => {
      this.recipe = result;
      this._recipeService.recipe = result;
    });
    /*
    this._recipeService.getAllRecipesCollection().ref.get().then(recipe => {
      this.recipe = recipe;
      console.log(this.recipe);
    });
    */
  }

  cardFavourite(recipe) {
    this._recipeService.toggleFavourite(recipe);
  }

  onClickRecipe(recipe : Recipe) {
    console.log("Clicked name: " + recipe.name);
    this._router.navigate(['recipe-list', recipe.name.toString()]);
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
    //this.initRecipe();
  }

  addDefaultRecipes() {
    this._recipeService.addDefaultRecipes();
  }

  trackRecipe(index, item) {
  }
}
