import { Component, OnInit } from '@angular/core';
import { ImgurService } from "../../../imgur.service";

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
})
export class ImageUploadComponentComponent implements OnInit {

  constructor(private _imgurService: ImgurService) { }

  ngOnInit() {}

  onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event);
    //let response = this._imgurService.registerApplication(event.target.files[0]);
    let response = this._imgurService.uploadImage(event.target.files[0]);
    console.log("Image added " + response);
    console.log(response);
  }

  uploadImage() {
    console.log("Image is being uploaded");
  }
}
