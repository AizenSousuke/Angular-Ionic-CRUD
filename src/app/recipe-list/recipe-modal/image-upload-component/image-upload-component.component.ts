import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from "../../../image.service";

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
  //providers: [{
  //  provide: ImageService
  //}],
})

export class ImageUploadComponentComponent implements OnInit {

  @ViewChild('imagePicker', {static: true}) imagePicker: ElementRef;
  
  @Input() imageUploaded = "";
  @Output() outputImageLink = new EventEmitter();

  constructor(private _imageService: ImageService) { }

  ngOnInit() {}

  async onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event);
    this.imageUploaded = "Uploading Image...";
    this.imageUploaded = await this._imageService.uploadImageAndReturnURL(event.target.files[0]);
    
    // Pass the imageUploaded URL string back to the recipe modal as imageLink
    this.outputImageLink.emit(this.imageUploaded);
  }
}
