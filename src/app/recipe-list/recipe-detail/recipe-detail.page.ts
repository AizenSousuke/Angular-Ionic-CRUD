import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeListPage } from '../recipe-list.page';
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
  ingredients: string[];
  timeNeeded: number;
  favourite: boolean;

  constructor(
    private _route : ActivatedRoute,
    private _recipeListComponent : RecipeListPage,
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
    this._recipeService.getRecipeById(parseInt(this._route.snapshot.paramMap.get('id'))).subscribe(data => {
      this.recipe = data;
      this.id = this.recipe.get('id');
      console.log("ID: " + this.id);
      this.name = this.recipe.get('name');
      this.imageLink = this.recipe.get('imageLink');
      this.description = this.recipe.get('description');
      this.ingredients = this.recipe.get('ingredients');
      this.timeNeeded = this.recipe.get('timeNeeded');
      this.favourite = this.recipe.get('favourite');
    });
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onDeleteRecipe() {
    this._recipeService.onDeleteRecipe(this.recipe);
  }

  onFavourite() {
    this._recipeService.setDocFavourite(parseInt(this._route.snapshot.paramMap.get('id')));
    this.favourite = !this.favourite;
    this.recipe = this._recipeService.getRecipeById(parseInt(this._route.snapshot.paramMap.get('id')));
  };
}
