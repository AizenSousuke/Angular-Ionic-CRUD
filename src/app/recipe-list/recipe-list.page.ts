import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.page.html',
  styleUrls: ['./recipe-list.page.scss'],
})
export class RecipeListPage implements OnInit {
  listOfRecipes : Recipe[] = [
    {
      name: 'Apple Pie',
      ingredients: [' Apple', ' Pie'],
    },
    {
      name: 'Milk Tea',
      ingredients: [' Milk', ' Tea'],
      favourite: true,
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  cardFavourite(item : Recipe) {
    // Toggle favourite
    if (item.favourite !== null) {
      item.favourite = !item.favourite;
      console.log("Favourite: " + item.favourite);
    }
  }

}
