import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecipeModalPage } from './recipe-modal.page';
import { ImageUploadComponentComponent } from "./image-upload-component/image-upload-component.component";

const routes: Routes = [
  {
    path: '',
    component: RecipeModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    RecipeModalPage, 
    ImageUploadComponentComponent
  ]
})
export class RecipeModalPageModule {}
