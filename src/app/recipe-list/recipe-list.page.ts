import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe';
import { Router } from '@angular/router';
import { RecipeServiceService } from '../recipe-service.service';
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from '../firebase-auth.service';
import { MenuController } from '@ionic/angular';
import { LoadingServiceService } from '../loading-service.service';
import { PopoverService } from '../popover.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.page.html',
  styleUrls: ['./recipe-list.page.scss'],
})
export class RecipeListPage implements OnInit {

  // To put in the page for Angular to loop through
  //recipe;
  //recipeSubscription: Subscription;

  menu: Promise<HTMLIonMenuElement>;
  menuItemLoggedIn: boolean;

  constructor(
      private _router: Router,
      public _recipeService: RecipeServiceService,
      private _menuController: MenuController,
      public _firebaseAuthService: FirebaseAuthService,
      private _loadingService: LoadingServiceService,
      private _popoverService: PopoverService,
    ) { 
    }

  ngOnInit() {
    this.initRecipe();
    this.menu = this._menuController.get("recipeListMenu");
  }

  initRecipe() {

    this._recipeService.sortBy("id");

    // Load data from the database and update it when there are any changes in realtime
    //this._loadingService.presentLoading();

    // this._recipeService.getRecipeWithUpdatesReference().get().then(result => {
    //   result.query.orderBy("id", "asc").get().then(newOrder => {
    //     this._recipeService.recipeArray = newOrder.docs;
    //     console.log(this._recipeService.recipeArray);
    //   }).then(() => {
    //     this._loadingService.dismissLoading();
    //   });
    // });

    // this._recipeService.getRecipeWithUpdatesReference().orderBy("id").get().then(results => {
    //   this._recipeService.recipeArray = results.docs;
    //   this._loadingService.dismissLoading();
    // });

    // this.recipeSubscription = this._recipeService.getRecipeWithUpdates().subscribe(results => {
    //   this._recipeService.recipeArray = results;
    //   this._loadingService.dismissLoading();
    // });
  }

  cardFavourite(recipe: Recipe) {
    // Convert to type QueryDocumentSnapshot first and get the first match
    this._recipeService.getRecipeWithoutUpdates("name", recipe.name).subscribe(results => {
      this._recipeService.toggleCardFavourite(results.docs[0]);
    })
  }

  onClickRecipe(recipe: Recipe) {
    console.log("Clicked name: " + recipe.name);
    this._router.navigate(['recipe-list', recipe.id]);
  }

  onAddRecipe() {
    this._recipeService.onAddRecipe();
  }

  onLogin(provider: string) {
    this._firebaseAuthService.onSignIn(provider);
    this.menu.then(menu => {
      menu.close();
    });
  }

  onLogout() {
    this._firebaseAuthService.onSignOut();
    this.menu.then(menu => {
      menu.close();
    });
  }

  onSort(event: any) {
    this._popoverService.onSort(event);
  }

  trackRecipe(index, item) {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    //this.recipeSubscription.unsubscribe();
  }
}
