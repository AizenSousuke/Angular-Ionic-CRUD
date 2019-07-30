import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.page.html',
  styleUrls: ['./recipe-modal.page.scss'],
})
export class RecipeModalPage implements OnInit {
  // Get the latest ID to use
  @Input() id: number;

  addRecipeForm = this._formBuilder.group({
    recipeName: '',
    imageLink: '',
    description: '',
    ingredients: '',
    timeNeeded: '',
    favourite: '',
  })

  constructor(
    private _modalController: ModalController,
    private _formBuilder: FormBuilder,
    private _angularFireStore: AngularFirestore,
  ) {
    
  }

  ngOnInit() {
    this._angularFireStore.collection('recipe-list').ref.get().then(recipe => {
      this.id = recipe.size + 1;
      console.log('ID in modal set to: ' + this.id);
    });
  }

  onSubmitRecipe(f: FormGroup) {
    // Convert string of ingredients to string[] by ','
    console.log('ID in modal before submitting is: ' + this.id);
    let data = {
      "id": this.id,
      "imageLink": 'https://cdn.auth0.com/blog/get-started-ionic/logo.png',
      "name": f.get('recipeName').value,
      "description": f.get('description').value,
      "ingredients": f.get('ingredients').value.split(','),
      "timeNeeded": f.get('timeNeeded').value,
      "favourite": f.get('favourite').value,
    }
    this._modalController.dismiss(data);
    //console.log(f);
  }

  onDismiss() {
    this._modalController.dismiss();
    console.log("Dismissed");
  }

}
