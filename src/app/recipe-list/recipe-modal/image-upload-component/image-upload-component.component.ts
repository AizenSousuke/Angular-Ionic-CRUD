import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImgurService } from "../../../imgur.service";

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
})

export class ImageUploadComponentComponent implements OnInit {

  imageUploaded = "Default image is assigned.";

  @ViewChild('imagePicker', {static: true}) imagePicker: ElementRef;

  constructor(private _imgurService: ImgurService) { }

  ngOnInit() {}

  async onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event);
    //this.imagePicker.nativeElement.src = await this._imgurService.uploadImage(event.target.files[0]);
    this.imageUploaded = "Uploading Image...";
    this.imageUploaded = "Image Uploaded: " + await this._imgurService.uploadImage(event.target.files[0]);
    //console.log(this.imagePicker.nativeElement.src);
    //let response = this._imgurService.registerApplication(event.target.files[0]);
    //let response = await this._imgurService.uploadImage(event.target.files[0]);
    //console.log("Image added " + response);
    //console.log(response);
  }

  uploadImage() {
    console.log("Image is being uploaded");
  }
}
