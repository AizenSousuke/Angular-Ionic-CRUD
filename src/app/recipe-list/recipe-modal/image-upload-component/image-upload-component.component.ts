import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ImgurService } from "../../../imgur.service";

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
  providers: [{
    provide: ImgurService
  }],
})

export class ImageUploadComponentComponent implements OnInit {

  @ViewChild('imagePicker', {static: true}) imagePicker: ElementRef;
  
  @Input() imageUploaded = "";
  @Output() outputImageLink = new EventEmitter();

  constructor(private _imgurService: ImgurService) { }

  ngOnInit() {
  }

  async onAddImage(event) {
    console.log("Attempting to add image");
    console.log(event.target.files[0].name);
    console.log(this._imgurService);
    this.imageUploaded = "Uploading Image...";
    this.imageUploaded = await this._imgurService.uploadImageAndReturnURL(event.target.files[0]);
    console.log(this.imageUploaded);
    // Pass the imageUploaded URL string back to the recipe modal as imageLink
    this.outputImageLink.emit(this.imageUploaded);
  }
}
