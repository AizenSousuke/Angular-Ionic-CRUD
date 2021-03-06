import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecipeListPage } from './recipe-list.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RecipeListPage],
  providers: [
  ]
})
export class RecipeListPageModule {}
