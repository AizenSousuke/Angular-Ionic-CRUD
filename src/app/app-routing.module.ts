import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'recipe-list', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'recipe-list',
    children: [
      {
        path: '', loadChildren: './recipe-list/recipe-list.module#RecipeListPageModule'
      },
      {
        path: ':id', loadChildren: './recipe-list/recipe-detail/recipe-detail.module#RecipeDetailPageModule'
      }
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
