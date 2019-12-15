import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from '../../../image.service';

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
})
export class ImageUploadComponentComponent implements OnInit {
  
  @Input() imageUploaded = "";
  @Output() outputImageFile = new EventEmitter();

  constructor(private _imageService: ImageService) { }

  ngOnInit() {
    console.log(this._imageService);
  }

  // Upload instantly on change
  /*
  async onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event.target.files[0].name);
    console.log(this._imageService);
    this.imageUploaded = "Uploading Image...";
    this.imageUploaded = await this._imageService.uploadImageAndReturnURL(event.target.files[0]);
    console.log(this.imageUploaded);
    // Pass the imageUploaded URL string back to the recipe modal as imageLink
    this.outputImageLink.emit(this.imageUploaded);
  }
  */

  // Just change the imageUploaded text
  onAddImage(event) {
    console.log("Attempting to add image");
    this.imageUploaded = event.target.files[0].name;
    console.log(this.imageUploaded);
    // Output the image File to be used in the recipe modal
    this.outputImageFile.emit(event.target.files[0]);
  }
}
