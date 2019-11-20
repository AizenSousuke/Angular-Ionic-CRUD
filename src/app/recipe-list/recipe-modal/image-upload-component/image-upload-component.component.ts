import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload-component',
  templateUrl: './image-upload-component.component.html',
  styleUrls: ['./image-upload-component.component.scss'],
})
export class ImageUploadComponentComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onAddImage() {
    
    console.log("Image added");
  }
}
