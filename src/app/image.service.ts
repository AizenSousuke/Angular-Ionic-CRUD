import { Injectable } from '@angular/core';
import { FirebaseStorage } from "@angular/fire";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private _firebaseStorage: FirebaseStorage) { }

  // Upload Image to Firebase Storage and return its URL
  async uploadImageAndReturnURL(image: File) {
    console.log(image);
    // Set the reference to firebase storage
    var storage = this._firebaseStorage.ref();
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
