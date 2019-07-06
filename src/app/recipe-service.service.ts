import { Injectable } from '@angular/core';
import { Recipe } from './recipe-list/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeServiceService {
  private listOfRecipes : Recipe[] = [
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

  constructor() { }

  getAllRecipes() {
    return this.listOfRecipes;
  }

  getRecipe(id : number) {
    this.listOfRecipes.forEach((recipe) => {
      if (recipe.id == id) {
        console.log("Recipe Name: " + recipe.name);
        return recipe;
      };
    });
  }

  toggleFavourite(recipe : Recipe) {
    recipe.favourite = !recipe.favourite;
    console.log(recipe.favourite);
  }
}
