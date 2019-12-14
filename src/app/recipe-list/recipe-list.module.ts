import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecipeListPage } from './recipe-list.page';
import { RecipeServiceService } from '../recipe-service.service';
import { ImageService } from '../image.service';

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
    RecipeServiceService,
  ]
})
export class RecipeListPageModule {}
