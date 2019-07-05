import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeListPage } from '../recipe-list.page';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  recipeName : string = '';

  constructor(private _route : ActivatedRoute,
              private _recipeListComponent : RecipeListPage
    ) { 
    console.log("Params: " + this._route.snapshot.paramMap.get('id'));
    this._recipeListComponent.listOfRecipes.forEach((res) => {
      if (res.id.toString() == this._route.snapshot.paramMap.get('id')) {
        this.recipeName = res.name;
        console.log("Recipe Name: " + res.name);
      }
    });
  }

  ngOnInit() {
  }

}
