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
    let response = this._imgurService.registerApplication(event.target.files[0]);
    console.log("Image added " + response);
    console.log(event);
  }

  uploadImage() {
    console.log("Image is being uploaded");
  }
}
