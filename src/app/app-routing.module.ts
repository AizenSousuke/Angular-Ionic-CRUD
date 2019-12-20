import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'recipe-list', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'recipe-list',
    children: [
      {
        path: ':id', loadChildren: './recipe-list/recipe-detail/recipe-detail.module#RecipeDetailPageModule'
      },
      {
        path: '', loadChildren: './recipe-list/recipe-list.module#RecipeListPageModule'
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
