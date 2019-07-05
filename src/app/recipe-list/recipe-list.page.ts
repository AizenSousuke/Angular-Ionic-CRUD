import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.page.html',
  styleUrls: ['./recipe-list.page.scss'],
})
export class RecipeListPage implements OnInit {
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
      ingredients: [' Milk', ' Tea'],
      favourite: true,
    }
  ];

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  cardFavourite(item : Recipe) {
    // Toggle favourite
    if (item.favourite !== null) {
      item.favourite = !item.favourite;
      console.log("Favourite: " + item.favourite);
    }
  }

  onClickRecipe(item : Recipe) {
    console.log("Clicked: " + item.name + " | id: " + item.id);
    this._router.navigate(['recipe-list', item.id]);
  }

}
