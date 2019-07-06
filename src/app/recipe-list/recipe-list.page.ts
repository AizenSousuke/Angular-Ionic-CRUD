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
  listOfRecipes : Recipe[];
  /*
  public listOfRecipes : Recipe[] = [
    {
      id: 1,
      imageLink: 'https://www.jocooks.com/wp-content/uploads/2013/10/classic-apple-pie-1-2-500x500.jpg',
      name: 'Apple Pie',
      ingredients: [' Apple', ' Pie'],
    },
    {
      id: 2,
      imageLink: 'https://www.ohhowcivilized.com/wp-content/uploads/2019/05/0519-bubble-tea-16-2.jpg',
      name: 'Milk Tea',
      description: 'Vivamus faucibus tincidunt eros sed scelerisque. Pellentesque bibendum urna at neque vehicula, in vulputate dolor porttitor. Duis finibus lectus vitae libero blandit, vel commodo magna tincidunt. Maecenas odio orci, luctus ac consectetur at, imperdiet at orci. Nunc efficitur odio elit. Nulla accumsan, enim at suscipit euismod, lectus justo viverra odio, a pulvinar felis elit quis eros. Donec tincidunt sed libero non iaculis.',
      ingredients: [' Milk', ' Tea'],
      timeNeeded: 70,
      favourite: true,
    }
  ];
  */

  constructor(
      private _router: Router,
      private _recipeService: RecipeServiceService,
    ) { 
      this.listOfRecipes = this._recipeService.getAllRecipes();
    }

  ngOnInit() {
  }

  cardFavourite(recipe : Recipe) {
    /*
    // Toggle favourite
    if (item.favourite !== null) {
      item.favourite = !item.favourite;
      console.log("Favourite: " + item.favourite);
    }
    */

    // Toggle favourite
    this._recipeService.toggleFavourite(recipe);
    // Refresh the data
    this.listOfRecipes = this._recipeService.getAllRecipes();
  }

  onClickRecipe(item : Recipe) {
    console.log("Clicked: " + item.name + " | id: " + item.id);
    this._router.navigate(['recipe-list', item.id]);
  }

}
