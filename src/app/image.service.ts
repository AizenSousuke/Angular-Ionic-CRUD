import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  // Upload Image to Firebase Storage and return its URL
  async uploadImageAndReturnURL(image: File) {
    console.log(image);
    // Set the reference to firebase storage
    var storage = firebase.storage().ref();
    // Save the image as imageName in firebase storage under the appropriate folder
    var imageName = image.name;
    return await storage.child("recipe_images/" + imageName).put(image).then(async results => {
      return await results.ref.getDownloadURL().then(async results => {
        console.log(results);
        // Return the url of the image once uploaded
        return await results;
      });
    });
  }
}
